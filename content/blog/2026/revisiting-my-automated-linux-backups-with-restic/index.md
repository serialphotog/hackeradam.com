---
title: "Revisiting My Automated Linux Backups With Restic"
description: "I've made a number of updates to my automated Linux backups. Let's take a look!"
date: 2026-10-06T06:31:03-06:00
tags: [Linux, Backups, Backblaze, Restic, Homelab]
draft: false
toc: true
aliases: []
---

Last year, I wrote about <a href="/blog/how-i-automate-backblaze-b2-backups-with-restic-on-linux/">how I automate my Linux backups with Restic and B2</a>. Tl;dr, I used a shell script to automate creating my backups and sending them to Backblaze B2. The script runs via a Systemd timer and uses Helthchecks.io to alert me if something goes ary. A lot of what I describe in that original post still applies to the new setup, so be sure to check that post out before continuing with this one if you want all of the details of how that original setup worked.

That script has served me well for the past year, but my homelab setup has evolved quite a bit since I first derived that backup solution. The server that I primarily run this script on runs a number of Samba shares and a whole host of Docker services. 

While re-working this setup, I couldn't help but ponder if my backup solution was still up to par. The honest answer was that, while it mostly got the job done, there was plenty that I could improve. So, I sat down and gave my backup setup and overhaul.

Let's take a look at the updates that I've mad.

# Issues with the original backup script

Before we get to the new features that I've added to the backup solution, let's take some time to look at the issues with the original script.

## The healthcheck was flawed

Here's what the original healthcheck function looked like:

```sh
ping_healthcheck() {
	local status="$1"
	curl -fsS -m 10 --retry 3 "${HEALTHCHECK_URL}${STATUS}" > /dev/null 2>&1
}
```

The astute reader may notice that this function is storing the argument in a variable called `status`, but it then uses `STATUS` as the argument to the healthcheck call. Since variables in bash are case-sensitive, the status that the script sends to healthchecks.io would always be empty. In practical terms, this means that the script would *always* report a success as soon as the backup script started.

To be fair, the failures would still get properly reported as that followed a different code path that worked correctly, but a backup that would hang and not complete would not be caught with this bug.

## My encryption password wasn't what I thought

In the original post, I put the repository password in the credentials file as follows:

```ini
export RESTIC_PASSWORD="choose_a_strong_password_for_encryption"
```

This is fine for most passwords, **unless** your password contains a `$` character. Since the credentials file is sourced by bash, the `$` character could cause part of the password to be expanded as a variable, thus resulting in a password that is shorter than you anticipated. Additionally, this could result in problems if you ever try to restore the backup using what you think is the full encryption password.

Long story short, my encryption password is a very long, random password that I store in my password manager and it happened to contain a `$` symbol in it. 

I fixed this by instead storing the password in its own file and pointing Restic at it with `RESTIC_PASSWORD_FILE`. Since Restic will read the file directly, we completely avoid the weirdness from the shell.

```ini
export B2_ACCOUNT_ID='your_keyID_here'
export B2_ACCOUNT_KEY='your_applicationKey_here'
export RESTIC_REPOSITORY='b2:your_bucket_name_here:/'
export RESTIC_PASSWORD_FILE=/root/.restic/password
```

I'm honestly not sure how I missed this one in the original script since I *did* test a restore, but I definitely did miss it the first time.

## The original timer was a bit quirky

My original Systemd timer for kicking off the backup job was as follows:

```ini
[Unit]
Description=Run Restic Backup Daily
Requires=restic-backup.service

[Timer]
OnCalendar=daily
OnCalendar=02:00
Persistent=true
```

This works, but it's certainly not perfect. For one, it contains two `OnCalendar` entries. This results in the timer firing both at midnight (from the `daily` entry) **and** again at 0200. Additionally, the `Requires` line isn't even necessary as Systemd already knows what service to trigger, since they share the same name. Here's the updated version of the timer:

```ini
[Unit]
Description=Run Restic Backup Daily

[Timer]
OnCalendar=02:00
Persistent=true

[Install]
WantedBy=timers.target
```

## My backup needs have evolved

The original script was largely intended to backup a desktop computer that I was using as my main machine. As such, it was setup to backup my `/home` and <a href="https://adamthompsonphoto.com" target="_blank">my photo archive</a>. That pattern no longer matches what I use this backup script for.

Earlier this year, I <a href="/blog/my-thoughts-on-mac/">I switched to a Mac as my primary computer</a>. While I still keep some Linux machines around for development and security research, those machines mostly backup to a central Linux server. 

The server runs some Samba shares and, more importantly, a bunch of Docker services. The Samba shares largely live in `/home`, but the Docker containers live in `/mnt/docker`. Additionally, I wanted to backup `/etc`, `/root`, and `/usr/` to ensure all of my configuration and custom scripts are included in the backup.

Beyond just updating the script to backup these new directories, I needed to ensure that the script can safely backup my Docker containers. This includes not only backing up the container data itself, but also any databases associated with the containers.

# Backup up live SQLite databases

My homelab deployment is quite small and largely just serves myself and my wife. As such, I have the vast majority of my services just use SQLite as their database backend.

With the original backup setup, Restic would simply copy the database files while they're in use. If the database happened to be in the middle of a write when Restic copies it, the copy could be inconsistent with the live data or, worse, corrupted. In all fairness, this is pretty unlikely given the small scale of my setup, but it's still worth accounting for.

The safe way to perform the backup is to simply use SQLite's <a href="https://www.sqlite.org/backup.html" target="_blank">online backup API</a>. This produces a consistent copy, even when the application is in the middle of a write.

We can make use of this by simply shoving some Python into the backup script (yes, this isn't the cleanest solution, but I like it being contained in the single script):

```sh
dump_sqlite() {
    local src="$1"
    local out="$DUMP_DIR/$2.db"

    log_message "Copying SQLite database $src..."
    if python3 - "$src" "$out.tmp" >> "$LOG_FILE" 2>&1 <<'EOF'
import sqlite3, sys
src = sqlite3.connect(f"file:{sys.argv[1]}?mode=ro", uri=True)
dst = sqlite3.connect(sys.argv[2])
src.backup(dst)
dst.close()
src.close()
EOF
    then
        mv "$out.tmp" "$out"
        log_message "SQLite copy of $src completed successfully"
    else
        rm -f "$out.tmp"
        log_message "SQLite copy of $src failed"
        FAILED_STEPS+=("sqlite:$src")
    fi
}
```

There's a few specifics here that I think are worth specifically calling out:

- The source database is opened as **read-only** (`mode=ro`). This is important to ensure that the script couldn't possibly modify the original database, even if I somehow made a mistake that might cause this.
- The copy is written to a `.tmp` file and is only renamed once the backup succeeds. This ensures that a failed copy will never overwrite the last good one.
- Rather than having a failure cause the entire script to fail, I instead record the failures into an array called `FAILED_STEPS`. This prevents one broken database copy from preventing the others from being backed up.

The backups themselves go into `/mnt/docker/_backups`, which is backed up by Restic.

# Backing up GitLab

One of the big services I run on my homelab is an internal GitLab instance. This service required special treatment as it's a significantly more complicated backup service.

For one, GitLab is using Postgres as it's database backend, not SQLite. Additionally, the most important data to be backed up from GitLab are the git repositories themselves. 

GitLab itself contains a backup tool, `gitlab-backup create`. This handles the database, uploads, CI artifacts, etc. As great as this is, there's a small catch to this tool - it will bundle *everything* (including the git repos) into a single tarball. This means that there will be a lot of duplication from tarball to tarball. Restic, however, is great at de-duplication, including a directory of git repositories. 

As such, I decided to split the GitLab backup into two steps:

1. `gitlab-backup create SKIP=repositories` handles the backup of everything **except** the repositories themselves.
2. I use restic snapshots on the bare repository directories directly. These are stored as a separate snapshot tagged `gitlab-repos`.

The `config/` directory for GitLab is already handled by the base backup of the docker directory. It's also worth calling out that, if your GitLab backup doesn't include the `gitlab-secrets.json` file, your backup will only be partially restorable. As such, you'll want to make sure that is included in your backup solution.

## Backup up the repositories

Taking a snapshot of a git repository while someone pushes to it has the exact same consistency problem as SQLite: we can end up with a capture of a half-written state. The way I get around this is pretty simply. I just stop GitLab for part of the backup.

To prevent GitLab from having to be down for a long period while the full data backup runs, I split it into two steps. 

For the first step, I just run Restic over the repos as normal, with GitLab running. This step does all of the heavy lifting of the backup while GitLab continues to run. I then run a second pass with Puma (handles pushes) and Sidekiq (handles background jobs) stopped. Restic de-duplicates the existing data and only uploads anything that might have changed over the last few seconds before these services were stopped. 

This solution results in GitLab only being down for about 2 seconds around 0200 every night. This is more than acceptable for my use case. Here's what that portion of the script looks like:

```sh
backup_gitlab_repos() {
    # Pass 1: Live backup
    log_message "Backing up GitLab repositories (live pre-pass)..."
    restic backup "$GITLAB_REPOS" --tag gitlab-repos-prepass \
        --exclude-file=/root/.restic/exclude.txt 2>&1 | tee -a "$LOG_FILE"

    # Pass 2: Pause GitLab and backup the deltas
    gitlab_pause
    trap 'gitlab_resume' EXIT
    trap 'exit 143' TERM INT
    log_message "Backing up GitLab repositories (paused)..."
    restic backup "$GITLAB_REPOS" --tag gitlab-repos \
        --exclude-file=/root/.restic/exclude.txt 2>&1 | tee -a "$LOG_FILE"
    local rc=${PIPESTATUS[0]}
    trap - EXIT TERM INT
    gitlab_resume
    ...
}
```

It's worth calling out the `trap` lines in this snippet. These ensure that even if the backup script gets killed for some reason, GitLab will still be brought back online.

After the snapshot succeeds, I delete the pre-pass snapshot with:

```
restic forget --tag gitlab-repos-prepass --unsafe-allow-remove-all
```

This only remove the snapshot record, keeping the shared data intact. This means that no data is lost from this.

# Weekly integrity checks

My original backup script did contain an integrity check that utilized `restic check`, but at some point I had commented that out. I re-enabled the integrity check and re-worked it to perform a weekly check:

```sh
if [ "$(date +%u)" -eq 7 ]; then
    log_message "Running repository check..."
    restic check --read-data-subset=5% 2>&1 | tee -a "$LOG_FILE"
    CHECK_EXIT_CODE=${PIPESTATUS[0]}
fi
```

The integrity is checked with `restic check`, but I also use `--read-data-subset=5%`. This will download a random 5% sample of the actual data to perform verification on.

# Better failure reporting

I completely re-worked the failure reporting of my backup script. For starters, the script now correctly only reports a success if the full backup truly is successful. The new logic for this is:

```sh
if [ $BACKUP_EXIT_CODE -eq 0 ] && [ $PRUNE_EXIT_CODE -eq 0 ] && [ $CHECK_EXIT_CODE -eq 0 ] && [ ${#FAILED_STEPS[@]} -eq 0 ]; then
	ping_healthcheck ""
	exit 0
else
	[ ${#FAILED_STEPS[@]} -gt 0 ] && log_message "Failed pre-backup steps: ${FAILED_STEPS[*]}"
	tail -n 20 "$LOG_FILE" | curl -fsS -m 10 --retry 3 --data-binary @- "${HEALTHCHECK_URL}/fail"
	exit 1
fi
```

The failed steps are written to the log directly before the last 20 lines of the log are sent to Healthchecks.io. This ensure that I'll be able to see *what* failed without having to SSH into the server to check the log just to figure out what went wrong.

# Metrics and reporting

Something else I run on my homelab is a Prometheus and Grafana setup for monitoring everything. Among the things that are aggregated with this setup is the status of my backup script. Rather than getting into details about this here, I'll save that for a future post, if there's interest in it.

# The full script

Now that I've yapped on about all of the improvements I've made to the script, let's go ahead and take a look at the full thing:

```sh
#!/bin/bash

# Load credentials
source /root/.restic/b2-credentials

# The ping URL for healthchecks
HEALTHCHECK_URL="<your_healthchecks_io_url_here>"

# Set log file
LOG_FILE="/var/log/restic-backup.log"

# Consistent database/app dumps land here so restic picks them up via /mnt/docker
DUMP_DIR="/mnt/docker/_backups"

# Names of any pre-backup steps that failed
FAILED_STEPS=()

# Function to log messages
log_message() {
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] $1" | tee -a "$LOG_FILE"
}

# Function to ping healthchecks.io
ping_healthcheck() {
	local status="$1"
	curl -fsS -m 10 --retry 3 "${HEALTHCHECK_URL}${status}" > /dev/null 2>&1
}

# Copy a live SQLite database safely using SQLite's online backup API
dump_sqlite() {
    local src="$1"
    local out="$DUMP_DIR/$2.db"

    log_message "Copying SQLite database $src..."
    if python3 - "$src" "$out.tmp" >> "$LOG_FILE" 2>&1 <<'EOF'
import sqlite3, sys
src = sqlite3.connect(f"file:{sys.argv[1]}?mode=ro", uri=True)
dst = sqlite3.connect(sys.argv[2])
src.backup(dst)
dst.close()
src.close()
EOF
    then
        mv "$out.tmp" "$out"
        log_message "SQLite copy of $src completed successfully"
    else
        rm -f "$out.tmp"
        log_message "SQLite copy of $src failed"
        FAILED_STEPS+=("sqlite:$src")
    fi
}

# Create a GitLab backup of everything except the git repositories 
backup_gitlab() {
    local tarball="/srv/gitlab/data/backups/nightly_gitlab_backup.tar"

    log_message "Creating GitLab backup (without repositories)..."
    docker exec gitlab gitlab-backup create \
        BACKUP=nightly STRATEGY=copy GZIP_RSYNCABLE=yes SKIP=repositories \
        2>&1 | tee -a "$LOG_FILE"

    # /srv and /mnt/docker are different filesystems, so mv is a copy: land it under
    # a temporary name so a failed copy never replaces the previous good tarball.
    if [ "${PIPESTATUS[0]}" -eq 0 ] && [ -s "$tarball" ] \
        && mv "$tarball" "$DUMP_DIR/gitlab_backup.tar.tmp" \
        && mv "$DUMP_DIR/gitlab_backup.tar.tmp" "$DUMP_DIR/gitlab_backup.tar"; then
        log_message "GitLab backup completed successfully"
    else
        rm -f "$DUMP_DIR/gitlab_backup.tar.tmp"
        log_message "GitLab backup failed"
        FAILED_STEPS+=("gitlab")
    fi
}

# GitLab's bare repositories, snapshotted by restic directly (tag gitlab-repos).
GITLAB_REPOS="/srv/gitlab/data/git-data/repositories"

# Stop GitLab's writers so repositories can't change mid-snapshot
gitlab_pause() {
    log_message "Pausing GitLab writes (puma, sidekiq)..."
    docker exec gitlab gitlab-ctl stop sidekiq >> "$LOG_FILE" 2>&1
    docker exec gitlab gitlab-ctl stop puma >> "$LOG_FILE" 2>&1
}
gitlab_resume() {
    log_message "Resuming GitLab writes..."
    docker exec gitlab gitlab-ctl start puma >> "$LOG_FILE" 2>&1
    docker exec gitlab gitlab-ctl start sidekiq >> "$LOG_FILE" 2>&1
}

backup_gitlab_repos() {
    # Pass 1 runs live and uploads whatever is new 
    log_message "Backing up GitLab repositories (live pre-pass)..."
    restic backup "$GITLAB_REPOS" --tag gitlab-repos-prepass \
        --exclude-file=/root/.restic/exclude.txt 2>&1 | tee -a "$LOG_FILE"

    # Pass 2 runs paused and only uploads what changed during pass 1
    gitlab_pause
    trap 'gitlab_resume' EXIT
    trap 'exit 143' TERM INT
    log_message "Backing up GitLab repositories (paused)..."
    restic backup "$GITLAB_REPOS" --tag gitlab-repos \
        --exclude-file=/root/.restic/exclude.txt 2>&1 | tee -a "$LOG_FILE"
    local rc=${PIPESTATUS[0]}
    trap - EXIT TERM INT
    gitlab_resume

    if [ "$rc" -eq 0 ]; then
        restic forget --tag gitlab-repos-prepass --unsafe-allow-remove-all 2>&1 | tee -a "$LOG_FILE"
        log_message "GitLab repository backup completed successfully"
    else
        log_message "GitLab repository backup failed with exit code $rc"
        FAILED_STEPS+=("gitlab-repos")
    fi
}

log_message "Starting backup..."

# Ping start of the backup
ping_healthcheck "/start"

# Pre-backup dumps
mkdir -p "$DUMP_DIR"
chmod 700 "$DUMP_DIR"

# Live SQLite databases: "<source path>|<dump name>"
PLEX_DB_DIR="/mnt/docker/plex/library/Library/Application Support/Plex Media Server/Plug-in Support/Databases"
SQLITE_DBS=(
    "/mnt/docker/karakeep/data/db.db|karakeep"
    "/mnt/docker/homeassistant/homeassistant/config/home-assistant_v2.db|homeassistant"
    "$PLEX_DB_DIR/com.plexapp.plugins.library.db|plex-library"
    "$PLEX_DB_DIR/com.plexapp.plugins.library.blobs.db|plex-library-blobs"
    "/mnt/docker/nginx-proxy-manager/data/database.sqlite|nginx-proxy-manager"
    "/mnt/docker/overseerr/overseerr/db/db.sqlite3|overseerr"
    "/mnt/docker/mealie/mealie/mealie.db|mealie"
    "/mnt/docker/calibre/data/app.db|calibre-web"
    "/mnt/docker/calibre/library/metadata.db|calibre-library"
    "/mnt/docker/rustdesk/data/db_v2.sqlite3|rustdesk"
)
for entry in "${SQLITE_DBS[@]}"; do
    dump_sqlite "${entry%|*}" "${entry##*|}"
done

backup_gitlab

# Run backup
restic backup \
    /home \
    /mnt/docker \
    /etc \
    /root \
    /usr/local/bin \
    --exclude-file=/root/.restic/exclude.txt \
    --verbose \
    2>&1 | tee -a "$LOG_FILE"

BACKUP_EXIT_CODE=${PIPESTATUS[0]}

if [ $BACKUP_EXIT_CODE -eq 0 ]; then
    log_message "Backup completed successfully"
else
    log_message "Backup failed with exit code $BACKUP_EXIT_CODE"
fi

backup_gitlab_repos

# Prune old backups (keep last 7 daily, 4 weekly, 6 monthly)
log_message "Pruning old backups..."
restic forget \
    --keep-daily 7 \
    --keep-weekly 4 \
    --keep-monthly 6 \
    --prune \
    2>&1 | tee -a "$LOG_FILE"

PRUNE_EXIT_CODE=${PIPESTATUS[0]}

if [ $PRUNE_EXIT_CODE -eq 0 ]; then
    log_message "Pruning completed successfully"
else
    log_message "Pruning failed with exit code $PRUNE_EXIT_CODE"
fi

# Weekly repository check
CHECK_EXIT_CODE=0
if [ "$(date +%u)" -eq 7 ]; then
    log_message "Running repository check..."
    restic check --read-data-subset=5% 2>&1 | tee -a "$LOG_FILE"
    CHECK_EXIT_CODE=${PIPESTATUS[0]}

    if [ $CHECK_EXIT_CODE -eq 0 ]; then
        log_message "Repository check completed successfully"
    else
        log_message "Repository check failed with exit code $CHECK_EXIT_CODE"
    fi
fi

log_message "Backup script finished"

# Report the status to healthchecks.io
if [ $BACKUP_EXIT_CODE -eq 0 ] && [ $PRUNE_EXIT_CODE -eq 0 ] && [ $CHECK_EXIT_CODE -eq 0 ] && [ ${#FAILED_STEPS[@]} -eq 0 ]; then
	ping_healthcheck ""
	exit 0
else
	# Failure - send failed steps and last 20 lines of log to healthchecks.io
	[ ${#FAILED_STEPS[@]} -gt 0 ] && log_message "Failed pre-backup steps: ${FAILED_STEPS[*]}"
	tail -n 20 "$LOG_FILE" | curl -fsS -m 10 --retry 3 --data-binary @- "${HEALTHCHECK_URL}/fail"
	exit 1
fi
```

Obviously, this script is very specific to my environment, so you'd need to adapt it to your needs if you decided to use it for yourself. 

# Wrapping up

While none of the changes I've made are particularly Earth shattering, they do result in a backup system that is a fair bit more robust and nicer to work with. Hopefully you've found this useful and maybe even took away some inspiration for your own backups!
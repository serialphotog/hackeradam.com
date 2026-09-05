function displayResults (results, store, query) {
  const searchResults = document.getElementById('results')
  const searchStatus = document.getElementById('search-status')
  searchResults.replaceChildren()

  if (results.length) {
    for (const result of results) {
      const item = store[result.ref]
      const listItem = document.createElement('li')
      const titleParagraph = document.createElement('p')
      const link = document.createElement('a')
      const excerpt = document.createElement('p')

      link.href = item.url
      link.textContent = item.title
      excerpt.textContent = item.content.substring(0, 150) + (item.content.length > 150 ? '…' : '')
      titleParagraph.append(link)
      listItem.append(titleParagraph, excerpt)
      searchResults.append(listItem)
    }

    searchStatus.textContent = `${results.length} ${results.length === 1 ? 'result' : 'results'} for “${query}”.`
  } else {
    searchStatus.textContent = `No results found for “${query}”.`
  }
}

// Get the query parameter(s)
const params = new URLSearchParams(window.location.search)
const query = (params.get('query') || '').trim().replace(/\s+/g, ' ')

// Perform a search if there is a query
if (query) {
  // Retain the search input in the form when displaying results
  document.getElementById('search-input').value = query

  const idx = lunr(function () {
    this.ref('id')
    this.field('title', {
      boost: 15
    })
    this.field('tags')
    this.field('content', {
      boost: 10
    })

    for (const key in window.store) {
      this.add({
        id: key,
        title: window.store[key].title,
        tags: window.store[key].tags,
        content: window.store[key].content
      })
    }
  })

  // Perform the search
  try {
    const results = idx.search(query)
    displayResults(results, window.store, query)
  } catch (error) {
    const searchStatus = document.getElementById('search-status')
    searchStatus.textContent = 'That search contains unsupported syntax. Try using plain words.'
  }
}

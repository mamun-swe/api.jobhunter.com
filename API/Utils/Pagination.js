
// Next page
const NextPage = (page, totalPage) => {
    if (page && page >= totalPage) {
        return null
    }
    return page + 1
}

// Prev page
const PrevPage = (page) => {
    if (page && page === 1) {
        return null
    }
    return page - 1
}


const Paginate = (data) => {
    const page = parseInt(data.page)
    const limit = parseInt(data.limit)
    const totalItems = parseInt(data.totalItems)

    if (!totalItems) return null

    const pageTotal = Math.ceil(totalItems / limit)
    return {
        totalItems: totalItems,
        totalPage: pageTotal,
        currentPage: page,
        limit: limit,
        prevPage: PrevPage(page),
        nextPage: NextPage(page, pageTotal)
    }
}


module.exports = { Paginate }
const PAGE_BLOCK = 9
const PAGE_INDENT = 4

function getPageConfig(current, totalPage) {
    let pageConfig = []

    if (totalPage <= PAGE_BLOCK) {
        // 全部展示的情况
        pageConfig = Array.from({ length: PAGE_BLOCK }).map((_, i) => i + 1)
    } else if (current + PAGE_INDENT >= totalPage ) {
        // ...只出现在末尾的情况
        pageConfig = [1, '...'].concat(Array.from({ length: PAGE_BLOCK - 2 }).map((_, i) => i + totalPage - PAGE_BLOCK + 3))
    } else if (current - PAGE_INDENT <= 1) {
        // ...只出现在末尾的情况
        pageConfig = Array.from({ length: PAGE_BLOCK - 2 }).map((_, i) => i + 1).concat(['...', totalPage])
    } else {
        // ...左右两边都存在的情况
        pageConfig = [...[1, '...'], ...Array.from({ length: PAGE_BLOCK - 4 }).map((_, i) => i + current - 2), ...['...', totalPage]]
    }

    return pageConfig
}

function render(current, totalPage) {
    const container = document.querySelector('.pagination')
    container.innerHTML = '';

    const pageList = getPageConfig(current, totalPage)
    const renderHtml =  pageList.map(item => {
        if(item === '...') return '<span>...</span>'

        return `
            <span class="pagination-item ${+item === current ? 'activate' : ''}">${item}</span>
        `
    })

    container.innerHTML = renderHtml.join('')
}

function init(callbacks) {
    const container = document.querySelector('.pagination')
    container.addEventListener('click', function (event) {
        const target = event.target
        const { classList, innerHTML } = target
        if (classList.contains('pagination-item')) {
            if(init.CURRENT_PAGE === +target.innerHTML) return;
            init.CURRENT_PAGE = +innerHTML
            render(+innerHTML, init.TOTAL_PAGE)
            callbacks && callbacks(+innerHTML, init.TOTAL_PAGE)
        }
    })

    render(5, 112)
    init.CURRENT_PAGE = 5
    init.TOTAL_PAGE = 112;
}

init()

const offset = el => {
    const result = {
        top: 0,
        left: 0
    }

    function getOffset(elem, init = false) {
        // 非有效节点
        if (!(elem && elem.nodeType === 1) || elem.nodeName === 'BODY') {
            return
        }

        let position = window.getComputedStyle(elem)['position']

        if (init && position !== 'static') {
            return getOffset(elem.parentNode)
        }

        result.top = result.top + elem.offsetTop - elem.scrollTop;
        result.left = result.left + elem.offsetLeft - elem.scrollLeft;

        if (position === 'fixed') {
            return;
        }

        getOffset(elem.parentNode);
    }

    getOffset(el)

    return result
}

const element = document.querySelector('.relative')
const icon = element.childNodes[3]

// setInterval(() => {
// }, 2000)

document.querySelector('#btn').addEventListener('click', () => {
    console.log(offset(icon))
})
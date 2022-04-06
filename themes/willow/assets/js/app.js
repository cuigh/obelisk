(() => {
    function on(el, evt, fn, opts = {}) {
        const delegatorFn = e => e.target.matches(opts.target) && fn.call(e.target, e);
        el.addEventListener(evt, opts.target ? delegatorFn : fn, opts.options || false);
        if (opts.target) return delegatorFn;
    }

    function closest(node, selector) {
        for (let n = node; n.parentNode; n = n.parentNode) {
            if (n.matches && n.matches(selector)) return n;
        }
        return null;
    }

    function excalidraw() {
        const elems = document.querySelectorAll(".excalidraw>span")
        for (let elem of elems) {
            const svg = ExcalidrawUtils.exportToSvg(JSON.parse(elem.innerText));
            const width = elem.dataset['width']
            const height = elem.dataset['height']
            if (width) {
                svg.removeAttribute('height')
                svg.setAttribute('width', width)
            }
            if (height) {
                svg.setAttribute('height', height)
            }
            elem.replaceWith(svg)
        }
    }

    function chart(container) {
        const elems = container.querySelectorAll("div.chart")
        for (let elem of elems) {
            const span = elem.querySelector('span')
            const cfg = JSON.parse(span.innerText)
            new Chart(elem.querySelector('canvas'), cfg)
            span.remove()
        }
    }

    function debounce(fn, wait) {
        let timeout = null;      //定义一个定时器
        return function () {
            timeout && clearTimeout(timeout);  //清除这个定时器
            timeout = setTimeout(fn, wait);
        }
    }

    function ready(callback) {
        if (document.readyState !== 'loading') {
            // in case the document is already rendered
            callback();
        } else {
            // modern browsers
            document.addEventListener('DOMContentLoaded', callback);
        }
    }

    function search(text) {
        if (!text) {
            return ''
        }

        const r = new RegExp(text, "gi");
        return obelisk.indexes.filter(idx => r.test(idx.title) || r.test(idx.path))
            .map((idx, n) => `<div class="suggestion-item${!n ? ' active' : ''}" data-url="${idx.url}">
        <div class="suggestion-title"><span>${highlight(idx.title, r)}</span><span class="suggestion-type">${idx.type || ''}</span></div>
        <div class="suggestion-note">${highlight(idx.path, r)}</div>
    </div>`)
            .join('')
    }

    function highlight(s, r) {
        return s?.replace(r, txt => '<strong>' + txt + '</strong>') ?? ''
    }

    function select(parent, down) {
        if (parent.childElementCount === 0) {
            return
        }

        const current = parent.querySelector('.active')
        let next
        if (current) {
            next = down ? (current.nextElementSibling ?? parent.firstElementChild) : (current.previousElementSibling ?? parent.lastElementChild)
        } else {
            next = parent.firstElementChild
        }

        if (next !== current) {
            current && current.classList.remove('active')
            next.classList.add('active')
            next.scrollIntoView({behavior: "auto", block: "nearest", inline: "nearest"});
        }
    }

    function redirect(path) {
        const base = '/' + document.getElementsByTagName('html')[0].dataset['url']
        const target = '/' + path
        location.href = relativeTo(base, target)
    }

    function relativeTo(base, target) {
        const common = commonPath(base, target);
        let parents = base.substring(common.length)
            .replace(/[^\/]*$/, '')
            .replace(/.*?\//g, '../');
        return (parents + target.substring(common.length)) || './';
    }

    function commonPath(one, two) {
        let length = Math.min(one.length, two.length);
        let pos = 0;

        // find first non-matching character
        for (; pos < length; pos++) {
            if (one.charAt(pos) !== two.charAt(pos)) {
                pos--;
                break;
            }
        }

        if (pos < 1) {
            return one.charAt(0) === two.charAt(0) && one.charAt(0) === '/' ? '/' : '';
        }

        // revert to last /
        if (one.charAt(pos) !== '/' || two.charAt(pos) !== '/') {
            pos = one.substring(0, pos).lastIndexOf('/');
        }

        return one.substring(0, pos + 1);
    }

    function copyToClipboard(str) {
        if (navigator && navigator.clipboard && navigator.clipboard.writeText)
            return navigator.clipboard.writeText(str);
        return Promise.reject('The Clipboard API is not available.');
    }

    function Backdrop() {
        let active = null;
        const backdrop = document.querySelector('body>.backdrop')
        const close = () => {
            active && active.classList.remove('show')
            backdrop.classList.remove('show')
        }

        on(backdrop, 'click', close)
        on(document, 'keyup', e => {
            e.key === 'Escape' && close()
        })

        return (elem) => {
            active && active.classList.remove('show')
            elem.classList.add('show')
            backdrop.classList.add('show')
            active = elem
        }
    }

    function Graph(elem) {
        let chart = echarts.init(elem);
        const option = {
            series: [
                {
                    type: 'graph',
                    layout: 'force',
                    label: {
                        show: true,
                        fontSize: 10,
                        position: 'bottom',
                        formatter: '{b}'
                    },
                    draggable: true,
                    animation: true,
                    nodes: obelisk.graph.nodes,
                    edges: obelisk.graph.edges,
                    emphasis: {
                        focus: 'adjacency',
                        label: {
                            show: true,
                            fontSize: 14,
                            fontWeight: 'bold',
                        },
                        itemStyle: {
                            shadowColor: 'rgba(0, 0, 0, 0.5)',
                            shadowBlur: 10
                        },
                    },
                    roam: true,
                    force: {
                        edgeLength: [50, 100],
                        repulsion: 100,
                        gravity: 0.2
                    },
                    lineStyle: {
                        width: 0.5,
                        opacity: 0.5
                    },
                }
            ]
        };
        chart.setOption(option);
        chart.on('click', {dataType: 'node'}, function (e) {
            redirect(e.data.url)
        });
        return chart
    }

    function TOC() {
        const marker = document.getElementById('toc-marker')
        if (!marker) return () => {
        }

        const links = new Map()
        document.getElementById('toc').querySelectorAll('li>a').forEach(e => {
            const id = decodeURIComponent(e.hash.substring(1))
            links.set(id, e)
        })
        const anchors = document.getElementById('content').querySelectorAll('h1,h2,h3,h4,h5,h6')

        let current = null
        return (scrollTop) => {
            let i = anchors.length - 1
            for (; i > 0; i--) {
                if (anchors.item(i).offsetTop < scrollTop + 5) {
                    break
                }
            }

            let link = links.get(anchors.item(i).id)
            if (link) {
                marker.style.opacity = '1'
                marker.style.top = link.offsetTop + 2 + 'px'
                current && current.classList.remove('active')
                link.classList.add('active')
                current = link
            }
        }
    }

    function Message() {
        let last;
        return (type, msg, time) => {
            let top = 12;
            if (last) {
                const elem = document.getElementById(last);
                if (elem) {
                    top = elem.offsetTop + elem.offsetHeight + 12
                }
            }
            let id = 'm-' + new Date().getTime()
            document.body.insertAdjacentHTML('beforeend', `<div id="${id}" class="message ${type || 'info'}" style="top: ${top + 'px'}">${msg}</div>`)
            last = id
            setTimeout(() => {
                document.getElementById(id).remove()
                if (last === id) {
                    last = null
                }
            }, time || 5000)
        }
    }

    ready(() => {
        const main = document.getElementById('main')
        const jumper = document.getElementById('jumper')
        const si = document.getElementById('search-input')
        const sr = document.getElementById('search-results')
        const message = Message()
        const toc = new TOC()
        const backdrop = Backdrop()
        let graph = null;

        // nav
        on(document.getElementById('nav'), 'click', function (e) {
            if (e.target.matches('.menu-folder>div,.menu-folder>div *')) {
                closest(e.target, '.menu-folder').classList.toggle('collapsed')
            }
        })
        on(document.getElementById('hamburger'), 'click', function (e) {
            backdrop(document.getElementById('aside'))
        })

        // scroll to top
        on(main, 'scroll', debounce(() => {
            jumper.style.display = main.scrollTop >= 150 ? 'block' : 'none'
            toc(main.scrollTop)
        }, 200))
        on(jumper, 'click', function (e) {
            main.scrollTo({top: 0, behavior: 'smooth'});
        })

        // search
        on(document, 'click', () => sr.style.display = 'none')
        on(document, 'keyup', e => {
            e.key === '/' && si.focus()
        })
        on(sr, 'click', function (e) {
            e.stopPropagation ? e.stopPropagation() : e.cancelBubble = true;
            const elem = e.target.closest('.suggestion-item');
            sr.style.display = 'none'
            redirect(elem.dataset['url'])
        })
        on(si, 'click', function (e) {
            e.stopPropagation ? e.stopPropagation() : e.cancelBubble = true;
        })
        on(si, 'focus', function (e) {
            const html = search(si.value)
            if (html) {
                sr.innerHTML = html
                sr.style.display = 'block'
            }
        })
        on(si, 'input', debounce(() => {
            const html = search(si.value)
            sr.innerHTML = html
            sr.style.display = html ? 'block' : 'none'
        }, 300))
        on(si, 'keydown', function (e) {
            if (!e.target.value || !sr.childElementCount) {
                return
            }

            if (e.keyCode === 40) { // down
                e.preventDefault()
                select(sr, true)
            } else if (e.keyCode === 38) { // up
                e.preventDefault()
                select(sr, false)
            } else if (e.keyCode === 13) { // enter
                const elem = sr.querySelector('.active')
                sr.style.display = 'none'
                redirect(elem.dataset['url'])
            }
        })

        // add copy icon to code blocks
        main.querySelectorAll('#content>pre').forEach(e => {
            e.insertAdjacentHTML('afterbegin', '<svg class="copy"><use xlink:href="#copy"/></svg>')
        })
        main.querySelectorAll('#content>pre>svg').forEach(elem => {
            on(elem, 'click', e => {
                let text = e.target.parentElement.textContent
                copyToClipboard(text).then(() => {
                    message('info', 'Copied.')
                }).catch(err => {
                    message('error', err)
                })
            })
        })

        // callout
        main.querySelectorAll('.callout-title>svg').forEach(svg => {
            const callout = closest(svg, '.callout')
            callout.lastElementChild.style.setProperty('--max-height', callout.lastElementChild.scrollHeight + 'px')
            on(svg, 'click', () => callout.classList.toggle('collapsed'))
        })

        // graph
        on(document.getElementById('graph-switcher'), 'click', e => {
            const elem = document.querySelector('body>.graph')
            backdrop(elem)
            if (graph) {
                graph.resize()
            } else {
                graph = Graph(elem)
            }
        })

        toc(0)
        excalidraw()
        chart(main)
    });
})(window)

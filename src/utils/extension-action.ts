export function injectScript(file_url: string, nodeTag: string) {
  const th = document.getElementsByTagName(nodeTag)[0]
  const script = document.createElement('script')
  script.id = chrome.runtime.id
  script.setAttribute('type', 'text/javascript')
  script.setAttribute('src', file_url)
  th.appendChild(script)
}

export function injectScriptByUrl(url: string) {
  const script = document.createElement('script')
  script.id = chrome.runtime.id
  script.setAttribute('type', 'text/javascript')
  script.setAttribute('src', url)
  document.head.appendChild(script)
}

export function injectMunual() {
  injectScript(chrome.extension.getURL('/js/inject.js'), 'body')
}

export function getActiveTabId() {
  return new Promise((resolve, reject) => {
    chrome.tabs.query({ active: true, lastFocusedWindow: true }).then((tab) => {
      const tabId = tab[0]?.id
      if (!tabId) reject()
      resolve(tabId)
    })
  })
}

export function injectCSS(file_url: string) {
  const head = document.head
  const script = document.createElement('link')
  script.id = chrome.runtime.id
  script.setAttribute('rel', 'stylesheet')
  script.setAttribute('type', 'text/css')
  script.setAttribute('href', file_url)
  head.appendChild(script)
}

type ContentRequestHandler = (
  data: any,
  sendResponse?: (response?: any) => void,
  tabId?: number,
) => void

type ContentReq = {
  [key: string]: ContentRequestHandler
}

export function initEventHandler(contentReq: ContentReq) {
  chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    const rdata = request.data
    const tabId = sender.tab?.id
    const handler = contentReq[request.greeting]
    if (handler) {
      handler(rdata, sendResponse, tabId)
    }
    return true
  })
}

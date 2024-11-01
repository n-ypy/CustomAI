import './modal.js';
import './keyInput.js';
import './purify.min.js';
import './theme.js';
import './scrollToBottom.js';
import { marked } from 'marked';
import hljs from 'highlight.js';

const apiURL = 'gpt'
const chatEl = document.querySelector('#chat')
const submitBtn = document.querySelector('#sub-btn')
const token = document.querySelector('#token')
const messagesDiv = document.querySelector('#messages')
const form = document.querySelector('#message-form')
const chatInput = document.querySelector('#form-inputs')
const messageInput = document.querySelector('#msg-input')
const bottomPaddingElement = document.querySelector('#bottom-padding')
const confirmDeleteBtn = document.querySelector('#confirm-delete')
const chatInputDisabledMsg = document.querySelector('#input-disabled-msg')
const modelSelect = document.querySelector('#model-select')
const infoModalElement = document.querySelector('#info-modal')
const remainingMsgElement = document.querySelector('#remaining-msg')
const openAiIcon = '<svg class="date-icon" viewBox="0 0 24 24" role="img" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"><title>OpenAI icon</title><path d="M22.2819 9.8211a5.9847 5.9847 0 0 0-.5157-4.9108 6.0462 6.0462 0 0 0-6.5098-2.9A6.0651 6.0651 0 0 0 4.9807 4.1818a5.9847 5.9847 0 0 0-3.9977 2.9 6.0462 6.0462 0 0 0 .7427 7.0966 5.98 5.98 0 0 0 .511 4.9107 6.051 6.051 0 0 0 6.5146 2.9001A5.9847 5.9847 0 0 0 13.2599 24a6.0557 6.0557 0 0 0 5.7718-4.2058 5.9894 5.9894 0 0 0 3.9977-2.9001 6.0557 6.0557 0 0 0-.7475-7.0729zm-9.022 12.6081a4.4755 4.4755 0 0 1-2.8764-1.0408l.1419-.0804 4.7783-2.7582a.7948.7948 0 0 0 .3927-.6813v-6.7369l2.02 1.1686a.071.071 0 0 1 .038.052v5.5826a4.504 4.504 0 0 1-4.4945 4.4944zm-9.6607-4.1254a4.4708 4.4708 0 0 1-.5346-3.0137l.142.0852 4.783 2.7582a.7712.7712 0 0 0 .7806 0l5.8428-3.3685v2.3324a.0804.0804 0 0 1-.0332.0615L9.74 19.9502a4.4992 4.4992 0 0 1-6.1408-1.6464zM2.3408 7.8956a4.485 4.485 0 0 1 2.3655-1.9728V11.6a.7664.7664 0 0 0 .3879.6765l5.8144 3.3543-2.0201 1.1685a.0757.0757 0 0 1-.071 0l-4.8303-2.7865A4.504 4.504 0 0 1 2.3408 7.872zm16.5963 3.8558L13.1038 8.364 15.1192 7.2a.0757.0757 0 0 1 .071 0l4.8303 2.7913a4.4944 4.4944 0 0 1-.6765 8.1042v-5.6772a.79.79 0 0 0-.407-.667zm2.0107-3.0231l-.142-.0852-4.7735-2.7818a.7759.7759 0 0 0-.7854 0L9.409 9.2297V6.8974a.0662.0662 0 0 1 .0284-.0615l4.8303-2.7866a4.4992 4.4992 0 0 1 6.6802 4.66zM8.3065 12.863l-2.02-1.1638a.0804.0804 0 0 1-.038-.0567V6.0742a4.4992 4.4992 0 0 1 7.3757-3.4537l-.142.0805L8.704 5.459a.7948.7948 0 0 0-.3927.6813zm1.0976-2.3654l2.602-1.4998 2.6069 1.4998v2.9994l-2.5974 1.4997-2.6067-1.4997Z"></path></g></svg>'
const warningIcon = '<svg class="date-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M256 32c14.2 0 27.3 7.5 34.5 19.8l216 368c7.3 12.4 7.3 27.7 .2 40.1S486.3 480 472 480H40c-14.3 0-27.6-7.7-34.7-20.1s-7-27.8 .2-40.1l216-368C228.7 39.5 241.8 32 256 32zm0 128c-13.3 0-24 10.7-24 24V296c0 13.3 10.7 24 24 24s24-10.7 24-24V184c0-13.3-10.7-24-24-24zm32 224a32 32 0 1 0 -64 0 32 32 0 1 0 64 0z"/></svg>'
const infoIcon = '<svg class="date-icon" xmlns="http://www.w3.org/2000/svg" viewbox="0 0 512 512"><path d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM216 336h24V272H216c-13.3 0-24-10.7-24-24s10.7-24 24-24h48c13.3 0 24 10.7 24 24v88h8c13.3 0 24 10.7 24 24s-10.7 24-24 24H216c-13.3 0-24-10.7-24-24s10.7-24 24-24zm40-208a32 32 0 1 1 0 64 32 32 0 1 1 0-64z"/></svg>'
let displayedMessages = []
let isChatInputDisabled = false
let modelSelectSet = false
let infoModalDisplayed = false


updateMessagesAndForm()


let updateMessagesAndFormInterval = setInterval(updateMessagesAndForm, 6000)


resize(messageInput)


messageInput.addEventListener('input', () => {
    if (messageInput.value.trim() !== '') {
        submitBtn.style.opacity = '100%'
        submitBtn.style.cursor = 'pointer'
    } else {
        submitBtn.style = null
    }
})


messageInput.addEventListener('keypress', function (e) {
    if (e.key === 'Enter' && !e.shiftKey) {
        submitFormUpdateMessages(e)
    }
})


submitBtn.addEventListener('click', submitFormUpdateMessages)

messageInput.addEventListener('input', () => {
    resize(messageInput)
})


confirmDeleteBtn.addEventListener('click', deleteMessages)


async function deleteMessages() {
    try {
        const response = await fetch(apiURL, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                message: '*'
            })
        })

        if (!response.ok) {
            return
        }
    } catch (error) {
        console.log(error)
        return
    }

    removeDisplayedMessages()
}


async function deleteOneMessage(messageId) {
    try {
        const response = await fetch(apiURL, {
            method: 'DELETE',
            hearders: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                message: messageId
            })
        })

        if (!response.ok) {
            return
        }
    } catch (error) {
        console.log(error)
    }

    removeOneDisplayedMessage(messageId)
}


async function updateMessagesAndForm() {
    try {
        const response = await fetch(apiURL, {
            method: 'GET'
        })

        if (isChatInputDisabled) {
            return
        }

        const responseData = await response.json()

        if (isChatInputDisabled) {
            return
        }

        if (!infoModalDisplayed && localStorage.getItem('isKeyValid') == true) {
            infoModalDisplayed = true
        } else if (!infoModalDisplayed) {
            showRemainingMsgModal(responseData.remainingFreeMsg)
        }

        removeErrorMsgUpdateFailed()
        insertMessagesAndConfigureForm(responseData)
    } catch (error) {
        console.log(error)
        showErrorMsgUpdateFailed()
    }
}


function showRemainingMsgModal(remainingMsg) {
    infoModalDisplayed = true
    remainingMsgElement.innerHTML = remainingMsg
    infoModalElement.parentElement.style.display = 'flex'
}


function insertMessagesAndConfigureForm(response) {
    token.value = response.token
    let messagesUpdated = false

    if (!modelSelectSet) {
        modelSelectSet = true
        response.models.forEach(model => {
            if (model.label === 'GPT 3.5') {
                modelSelect.innerHTML += `<option value='${model.value}' selected>${model.label}</option>`
            } else {
                modelSelect.innerHTML += `<option value='${model.value}'>${model.label}</option>`
            }
        })
    }

    response.messages.forEach(message => {
        const uuid = uuidv4()
        if (displayedMessages.length === 0) {
            messagesUpdated = true
            displayFirstMessage(message, uuid)
        } else if (displayedMessages.find(object => { return object.id === message['id'] }) === undefined) {
            messagesUpdated = true
            displayMessage(message, uuid)
        }
    })

    displayedMessages.forEach(message => {
        if (response.messages.find(object => { return object.id === message.id }) === undefined) {
            removeOneDisplayedMessage(message.id)
        }
    })

    if (messagesUpdated) {
        messagesDiv.scrollTo({ top: messagesDiv.scrollHeight })
    }
}


async function submitFormUpdateMessages(event) {
    event.preventDefault()
    const formData = new FormData(form)
    const sentMessageContent = formData.get('message[content]')

    if (!verifyConditionsBeforeStubmit(sentMessageContent)) {
        return
    }

    submitBtn.style = null
    clearInterval(updateMessagesAndFormInterval)
    isChatInputDisabled = true
    messagesLoading(sentMessageContent)

    try {
        const response = await fetch(apiURL, {
            method: 'POST',
            body: formData
        })

        if (response.status === 401) {
            warningMsgFormSubmitFailed(true)
            isChatInputDisabled = false
            updateMessagesAndFormInterval = setInterval(updateMessagesAndForm, 6000)
            return
        }
        const responseData = await response.json()

        removeWarningMsgFormSubmitFailed()
        messagesLoaded(responseData)
    } catch (error) {
        warningMsgFormSubmitFailed()
        isChatInputDisabled = false
    }


    updateMessagesAndFormInterval = setInterval(updateMessagesAndForm, 6000)
}


function messagesLoading(messageSentContent) {
    messageSentContent = DOMPurify.sanitize(convertStringToHTMLEntities(messageSentContent))
    messageInput.value = ''
    resize(messageInput)
    bottomPaddingElement.insertAdjacentHTML('beforebegin',
        `<div class="user-container message-container" id="loading-user-container">
            <div class="user">
                <div class="message-content">${messageSentContent}</div>
            </div>
            <div class="date-container">
                <div class="date">${getFormattedDate()}</div>
            </div>
        </div>
        <div class="assistant-container message-container" id="loading-assistant-container" style="display: none;">
            <div class="assistant">
                <div class="message-content" id="loading-message-content"></div>
            </div>
            <div class="date-container">
                <div class="date" id="loading-date">Loading...</div>
            </div>
        </div>`)

    const assistantLoadingContainer = document.querySelector('#loading-assistant-container')
    messagesDiv.scrollTo({ top: messagesDiv.scrollHeight, behavior: 'smooth' })
    setTimeout(() => {
        assistantLoadingContainer.style.display = null
        if (document.querySelector('#loading-assistant-container') !== null) {
            messagesDiv.scrollTo({ top: messagesDiv.scrollHeight, behavior: 'smooth' })
        }
    }, 400)
}


function messagesLoaded(response) {
    token.value = response.token

    const userUuid = uuidv4()
    const loadingUserDiv = document.querySelector('#loading-user-container')
    loadingUserDiv.id = `${response.userMessage.role}-${userUuid}`
    displayedMessages.push({
        id: response.userMessage.id,
        uuid: userUuid,
        role: response.userMessage.role,
        timestamp: response.userMessage.createdAt.timestamp,
        content: response.userMessage.content
    })
    loadingUserDiv.querySelector('.date-container')
        .appendChild(addDeleteButton(response.userMessage.id))

    const assistantUuid = uuidv4()
    const loadingAssistantDiv = document.querySelector('#loading-assistant-container')
    loadingAssistantDiv.id = `${response.assistantMessage.role}-${assistantUuid}`
    const loadingDateDiv = document.querySelector('#loading-date')
    loadingDateDiv.innerHTML = getFormattedDate(response.assistantMessage.createdAt.timestamp, response.assistantMessage)
    loadingDateDiv.removeAttribute('id')
    const loadingMessageContentDiv = document.querySelector('#loading-message-content')
    displayedMessages.push({
        id: response.assistantMessage.id,
        uuid: assistantUuid,
        role: response.assistantMessage.role,
        timestamp: response.assistantMessage.createdAt.timestamp,
        content: response.assistantMessage.content
    })
    loadingAssistantDiv.querySelector('.date-container')
        .appendChild(addDeleteButton(response.assistantMessage.id))

    const assistantMessageContent = DOMPurify.sanitize(marked.parse(convertStringToHTMLEntities(response.assistantMessage.content)))

    displayAssistantMessage(loadingMessageContentDiv, assistantMessageContent, assistantUuid)

    loadingMessageContentDiv.removeAttribute('id')
}


function displayAssistantMessage(loadingMessageContentDiv, assistantMessageContent, assistantUuid) {
    loadingMessageContentDiv.innerHTML = assistantMessageContent
    highlightCodeInsideMessage(`#${loadingMessageContentDiv.id}`)

    const bottomPaddingElementHeight = setDivWidthWithContent(loadingMessageContentDiv)

    const shouldScroll = !(bottomPaddingElementHeight >= Math.floor(document.body.clientHeight * 0.92))

    if (shouldScroll) {
        messagesDiv.scrollTo({ top: messagesDiv.scrollHeight, behavior: 'smooth' })
    }

    const extractedText = extractTextBetweenTags(loadingMessageContentDiv)

    animateTyping(loadingMessageContentDiv, extractedText, bottomPaddingElementHeight, assistantUuid)

}


function animateTyping(loadingMessageContentDiv, extractedText, bottomPaddingHeight, assistantUuid, msgIndex = 0, textIndex = 0) {
    const message = extractedText[msgIndex]
    message.parentElement.style.display = null
    message.parentElement.parentNode.style.display = null

    const messageFound = displayedMessages.find((message) => {
        return message.uuid === assistantUuid
    })

    if (!messageFound) {
        isChatInputDisabled = false
        bottomPaddingElement.style.height = null
        return
    }

    if (textIndex < message.textContent.length && message.textContent !== '\n') {
        message.textNode.textContent = message.textContent.slice(0, textIndex) + '█'

        textIndex += Math.floor(Math.random() * 5)

        setTimeout(() => {
            animateTyping(loadingMessageContentDiv, extractedText, bottomPaddingHeight, assistantUuid, msgIndex, textIndex)
        }, Math.floor(Math.random() * 90))

        bottomPaddingElement.style.height = (bottomPaddingHeight + 32) - loadingMessageContentDiv.clientHeight + 'px'

    } else {
        message.textNode.textContent = message.textContent
        if (extractedText[msgIndex + 1]) {

            setTimeout(() => {
                animateTyping(loadingMessageContentDiv, extractedText, bottomPaddingHeight, assistantUuid, msgIndex + 1)
            }, Math.floor(Math.random() * 90))


        } else {
            isChatInputDisabled = false
            loadingMessageContentDiv.style.width = null
            loadingMessageContentDiv.parentElement.style.overflowX = null
            bottomPaddingElement.style.height = null

        }
    }
}


function getFormattedDate(timestamp = Date.now() / 1000, message = false) {

    const dateToday = new Date()
    const date = new Date(timestamp * 1000)

    const formattedDate = date.toLocaleString('en-GB', {
        weekday: 'short',
        day: 'numeric',
        month: 'short',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
    })

    const dateWithoutCommas = formattedDate.split(',').join('')
    let dateArray = dateWithoutCommas.split(' ')

    if (dateToday.getDay() === date.getDay()
        && dateToday.getMonth() === date.getMonth()
        && dateToday.getFullYear() === date.getFullYear()) {
        dateArray.shift()
        dateArray.shift()
        dateArray.shift()
    } else {
        let mounth = dateArray[1]
        dateArray[1] = dateArray[2]
        dateArray[2] = mounth
        dateArray[3] = '| ' + dateArray[3]
    }

    if (message && message.role === 'assistant') {
        dateArray.unshift(' | ')
        dateArray.unshift(message.model.uiName)
        dateArray.unshift(openAiIcon)
    }

    return dateArray.join(' ')
}


function addDeleteButton(messageId) {
    const deleteBtn = document.createElement('div')
    deleteBtn.classList.add('delete-msg-btn')
    deleteBtn.innerHTML = '<svg class="date-icon" xmlns="http://www.w3.org/2000/svg" viewbox="0 0 448 512"><path d="M135.2 17.7L128 32H32C14.3 32 0 46.3 0 64S14.3 96 32 96H416c17.7 0 32-14.3 32-32s-14.3-32-32-32H320l-7.2-14.3C307.4 6.8 296.3 0 284.2 0H163.8c-12.1 0-23.2 6.8-28.6 17.7zM416 128H32L53.2 467c1.6 25.3 22.6 45 47.9 45H346.9c25.3 0 46.3-19.7 47.9-45L416 128z"/></svg>'

    deleteBtn.addEventListener('click', () => {
        deleteOneMessage(messageId)
    })

    return deleteBtn
}


function uuidv4() {
    return '10000000-1000-4000-8000-100000000000'.replace(/[018]/g, c =>
        (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
    )
}


function resize(messageInput) {
    messageInput.style.height = 'auto'
    messageInput.style.height = messageInput.scrollHeight + 'px'
}


function verifyConditionsBeforeStubmit(sentMessageContent) {
    if (isChatInputDisabled) {
        setErrMsOnInput('chadDisabled')
        return false
    }

    if (sentMessageContent.trim() === '') {
        setErrMsOnInput('inputEmpty')
        return false
    }

    return true
}


function setErrMsOnInput(err) {
    switch (err) {
        case 'inputEmpty':
            chatInputDisabledMsg.style.display = 'block'
            chatInputDisabledMsg.innerHTML = warningIcon + ' The message should not be empty.'
            chatInput.style.border = '1px solid #DD4A48'
            break

        case 'chadDisabled':
            chatInputDisabledMsg.style.display = 'block'
            chatInputDisabledMsg.innerHTML = warningIcon + ' Please wait until the message finishes loading...'
            chatInput.style.border = '1px solid #DD4A48'
            break

        default:
            break
    }

    setTimeout(() => {
        chatInputDisabledMsg.style.display = null
        chatInput.style.border = null
    }, 4500)
}


function warningMsgFormSubmitFailed(isInfoMessage = false) {
    const loadingUserContainer = document.querySelector('#loading-user-container')
    const loadingAssistantContainer = document.querySelector('#loading-assistant-container')
    const userDiv = loadingUserContainer.querySelector('.user')
    const assistantDiv = loadingAssistantContainer.querySelector('.assistant')
    const assistantContainerMsgContent = loadingAssistantContainer.querySelector('.message-content')
    const userContainerMsgContent = loadingUserContainer.querySelector('.message-content')
    const assistantContainerDate = loadingAssistantContainer.querySelector('.date')
    const userContainerDate = loadingUserContainer.querySelector('.date')

    loadingUserContainer.removeAttribute('id')
    loadingAssistantContainer.removeAttribute('id')

    assistantContainerMsgContent.removeAttribute('id')
    userContainerMsgContent.removeAttribute('id')

    if (isInfoMessage) {
        userDiv.setAttribute('class', 'user info-message loading-failed')
        assistantDiv.setAttribute('class', 'assistant info-message loading-failed')

        assistantContainerMsgContent.innerHTML = infoIcon + ' <b>Message Limit Exceeded: Four Messages Per Day</b><br>Thank you for using the trial version of CustomAI. Unfortunately, you have reached the maximum limit of four messages per day. If you require a higher messaging capacity, please consider upgrading to our premium version. For inquiries and to obtain a premium key, please contact us at <a href="mailto:ebusy9@gmail.com">ebusy9@gmail.com<a/>. We appreciate your understanding and look forward to assisting you further.'

        assistantContainerDate.setAttribute('class', 'date info-date date-loading-failed')
        userContainerDate.setAttribute('class', 'date info-date date-loading-failed')
        userContainerDate.innerHTML = infoIcon + ' ' + userContainerDate.innerHTML
        assistantContainerDate.innerHTML = infoIcon + ' CustomAI | ' + getFormattedDate()
    } else {
        userDiv.setAttribute('class', 'user error-message loading-failed')
        assistantDiv.setAttribute('class', 'assistant error-message loading-failed')

        assistantContainerMsgContent.innerHTML = warningIcon + ' <b>An error occurred while processing your request.</b><br>Please check your internet connection and try again. If the issue persists, please don\'t hesitate to reach out to us at <a href="mailto:ebusy9@gmail.com">ebusy9@gmail.com</a>. Your understanding is highly appreciated, and we are eager to assist you further.'

        assistantContainerDate.setAttribute('class', 'date error-date date-loading-failed')
        userContainerDate.setAttribute('class', 'date error-date date-loading-failed')
        userContainerDate.innerHTML = warningIcon + ' ' + userContainerDate.innerHTML
        assistantContainerDate.innerHTML = warningIcon + ' CustomAI | ' + getFormattedDate()
    }

    loadingAssistantContainer.style.display = null
    messagesDiv.scrollTo({ top: messagesDiv.scrollHeight, behavior: 'smooth' })
}


function removeWarningMsgFormSubmitFailed() {
    if (document.querySelector('.loading-failed') !== null) {
        document.querySelectorAll('.loading-failed').forEach((element) => {
            element.parentElement.remove()
        })
    }
}


function showErrorMsgUpdateFailed() {
    if (messagesDiv.querySelector('.user-container') === null
        && messagesDiv.querySelector('.assistant-container') === null
        && messagesDiv.querySelector('#update-failed-err-msg') === null) {
        bottomPaddingElement.insertAdjacentHTML('beforebegin', `<div id="update-failed-err-msg">${warningIcon} <p> An error occurred while loading messages. Please check your internet connection and try again.</p></div>`)
    }
}


function removeErrorMsgUpdateFailed() {
    const warningMessage = document.querySelector('#update-failed-err-msg')
    if (warningMessage !== null) {
        warningMessage.remove()
    }
}


function convertStringToHTMLEntities(inputString) {
    const preCodeBlockRegex = /```[a-z]*\s*([\s\S]*?)\s*```/gm
    const codeBlockRegex = /`[a-z]*\s*([\s\S]*?)\s*`/gm

    const preCodeBlocks = []
    const codeBlocks = []
    const preCodeBlockPlaceholder = '%%PRECODEBLOCK%%'
    const codeBlockPlaceholder = '%%CODEBLOCK%%'
    let convertedString = inputString.replace(preCodeBlockRegex, (match, preCodeBlock) => {
        preCodeBlocks.push(match)
        return preCodeBlockPlaceholder
    })

    convertedString = inputString.replace(codeBlockRegex, (match, codeBlock) => {
        codeBlocks.push(match)
        return codeBlockPlaceholder
    })

    convertedString = convertedString.replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;')

    convertedString = convertedString.replace(new RegExp(preCodeBlockPlaceholder, 'g'), () => {
        return preCodeBlocks.shift()
    })

    convertedString = convertedString.replace(new RegExp(codeBlockPlaceholder, 'g'), () => {
        return codeBlocks.shift()
    })

    return convertedString
}


function highlightCodeInsideMessage(selector) {

    const element = document.querySelector(selector)

    if (element.querySelector('pre code') !== null) {

        element.querySelectorAll('pre code').forEach((el) => {
            hljs.highlightElement(el)
        })

    }
    return
}


function displayFirstMessage(message, uuid) {
    const messageContent = DOMPurify.sanitize(marked.parse(convertStringToHTMLEntities(message['content'])))
    displayedMessages = [{
        id: message['id'],
        uuid: uuid,
        role: message['role'],
        timestamp: message['createdAt']['timestamp'],
        content: message['content']
    }]
    bottomPaddingElement.insertAdjacentHTML('beforebegin', generateMessageHtml(message, messageContent, uuid))

    document.querySelector(`#${message['role']}-${uuid}`)
        .querySelector('.date-container')
        .appendChild(addDeleteButton(message['id']))

    highlightCodeInsideMessage(`#${message['role']}-${uuid}`)
}


function displayMessage(message, uuid) {
    const messageContent = DOMPurify.sanitize(marked.parse(convertStringToHTMLEntities(message['content'])))
    displayedMessages.push({
        id: message['id'],
        uuid: uuid,
        role: message['role'],
        timestamp: message['createdAt']['timestamp'],
        content: message['content']
    })

    displayedMessages = displayedMessages.sort((aObject, bObject) => {
        const aTimestamp = aObject.timestamp
        const bTimestamp = bObject.timestamp
        if (aTimestamp > bTimestamp) {
            return 1
        }
        if (aTimestamp < bTimestamp) {
            return -1
        }
        return 0
    })

    const indexOfMessage = displayedMessages.findIndex(object => { return object.uuid === uuid })

    if (indexOfMessage === 0) {
        messagesDiv.insertAdjacentHTML('afterbegin', generateMessageHtml(message, messageContent, uuid))
    }

    if (indexOfMessage > 0) {
        const indexOfPreviousMessage = indexOfMessage - 1

        const previousMessageDiv = document.querySelector(`#${displayedMessages[indexOfPreviousMessage].role}-${displayedMessages[indexOfPreviousMessage].uuid}`)

        previousMessageDiv.insertAdjacentHTML('afterend', generateMessageHtml(message, messageContent, uuid))
    }

    document.querySelector(`#${message['role']}-${uuid}`)
        .querySelector('.date-container')
        .appendChild(addDeleteButton(message['id']))

    highlightCodeInsideMessage(`#${message['role']}-${uuid}`)
}


function generateMessageHtml(message, messageContent, uuid) {
    return `<div class="${message['role']}-container message-container" id="${message['role']}-${uuid}">
                <div class="${message['role']}">
                    <div class="message-content">${messageContent}</div>
                </div>
                <div class="date-container">
                    <div class="date">${getFormattedDate(message['createdAt']['timestamp'], message)}</div>
                </div>
            </div>`
}


function extractTextBetweenTags(loadingMessageContentDiv) {

    const text = []
    const walker = document.createTreeWalker(loadingMessageContentDiv, NodeFilter.SHOW_TEXT, null, false)

    while (walker.nextNode()) {
        text.push({
            'textContent': walker.currentNode.textContent,
            'textNode': walker.currentNode,
            'parentElement': walker.currentNode.parentNode
        })

        walker.currentNode.textContent = ''
    }

    const elements = loadingMessageContentDiv.querySelectorAll('*')
    elements.forEach((element) => {
        element.style.display = 'none'
    })

    return text
}


function setDivWidthWithContent(div) {
    const cloneDivEl = div.cloneNode(true)
    const cloneDivWrapperEl = document.createElement('div')
    cloneDivWrapperEl.style.margin = '8p'
    cloneDivWrapperEl.style.maxWidth = '75vw'
    cloneDivWrapperEl.style.padding = '1rem'

    cloneDivWrapperEl.appendChild(cloneDivEl)

    cloneDivWrapperEl.style.position = 'absolute'
    cloneDivWrapperEl.style.top = '-1000px'

    chatEl.appendChild(cloneDivWrapperEl)

    const width = cloneDivEl.clientWidth

    bottomPaddingElement.style.height = bottomPaddingElement.clientHeight + cloneDivEl.clientHeight - 32 + 'px'

    chatEl.removeChild(cloneDivWrapperEl)

    div.style.width = `${width}px`
    div.parentElement.style.overflowX = 'hidden'

    return bottomPaddingElement.clientHeight
}


function removeDisplayedMessages() {
    for (let index = 0; index < displayedMessages.length; index++) {
        document.querySelector(`#${displayedMessages[index].role}-${displayedMessages[index].uuid}`).remove()
    }

    displayedMessages = []
}


function removeOneDisplayedMessage(messageId) {
    const indexMessageToRemove = displayedMessages.findIndex((message) => {
        return message.id === messageId
    })

    document.querySelector(`#${displayedMessages[indexMessageToRemove].role}-${displayedMessages[indexMessageToRemove].uuid}`).remove()

    displayedMessages.splice(indexMessageToRemove, 1)
}
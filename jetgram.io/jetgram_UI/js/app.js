// (() => {
	
	
    "use strict";
    const modules_flsModules = {};
    function isWebp() {
        function testWebP(callback) {
            let webP = new Image;
            webP.onload = webP.onerror = function() {
                callback(webP.height == 2);
            };
            webP.src = "data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAACyAgCdASoCAAIALmk0mk0iIiIiIgBoSygABc6WWgAA/veff/0PP8bA//LwYAAA";
        }
        testWebP((function(support) {
            let className = support === true ? "webp" : "no-webp";
            document.documentElement.classList.add(className);
        }));
    }
    let isMobile = {
        Android: function() {
            return navigator.userAgent.match(/Android/i);
        },
        BlackBerry: function() {
            return navigator.userAgent.match(/BlackBerry/i);
        },
        iOS: function() {
            return navigator.userAgent.match(/iPhone|iPad|iPod/i);
        },
        Opera: function() {
            return navigator.userAgent.match(/Opera Mini/i);
        },
        Windows: function() {
            return navigator.userAgent.match(/IEMobile/i);
        },
        any: function() {
            return isMobile.Android() || isMobile.BlackBerry() || isMobile.iOS() || isMobile.Opera() || isMobile.Windows();
        }
    };
    let bodyLockStatus = true;
    let bodyUnlock = (delay = 500) => {
        let body = document.querySelector("body");
        if (bodyLockStatus) {
            let lock_padding = document.querySelectorAll("[data-lp]");
            setTimeout((() => {
                for (let index = 0; index < lock_padding.length; index++) {
                    const el = lock_padding[index];
                    el.style.paddingRight = "0px";
                }
                body.style.paddingRight = "0px";
                document.documentElement.classList.remove("lock");
            }), delay);
            bodyLockStatus = false;
            setTimeout((function() {
                bodyLockStatus = true;
            }), delay);
        }
    };
    let bodyLock = (delay = 500) => {
        let body = document.querySelector("body");
        if (bodyLockStatus) {
            let lock_padding = document.querySelectorAll("[data-lp]");
            for (let index = 0; index < lock_padding.length; index++) {
                const el = lock_padding[index];
                el.style.paddingRight = window.innerWidth - document.querySelector(".wrapper").offsetWidth + "px";
            }
            body.style.paddingRight = window.innerWidth - document.querySelector(".wrapper").offsetWidth + "px";
            document.documentElement.classList.add("lock");
            bodyLockStatus = false;
            setTimeout((function() {
                bodyLockStatus = true;
            }), delay);
        }
    };
    function functions_FLS(message) {
        setTimeout((() => {
            if (window.FLS) console.log(message);
        }), 0);
    }
    class Popup {
        constructor(options) {
            let config = {
                logging: true,
                init: true,
                attributeOpenButton: "data-popup",
                attributeCloseButton: "data-close",
                fixElementSelector: "[data-lp]",
                youtubeAttribute: "data-popup-youtube",
                youtubePlaceAttribute: "data-popup-youtube-place",
                setAutoplayYoutube: true,
                classes: {
                    popup: "popup",
                    popupContent: "popup__content",
                    popupActive: "popup_show",
                    bodyActive: "popup-show"
                },
                focusCatch: true,
                closeEsc: true,
                bodyLock: true,
                hashSettings: {
                    location: true,
                    goHash: true
                },
                on: {
                    beforeOpen: function() {},
                    afterOpen: function() {},
                    beforeClose: function() {},
                    afterClose: function() {}
                }
            };
            this.youTubeCode;
            this.isOpen = false;
            this.targetOpen = {
                selector: false,
                element: false
            };
            this.previousOpen = {
                selector: false,
                element: false
            };
            this.lastClosed = {
                selector: false,
                element: false
            };
            this._dataValue = false;
            this.hash = false;
            this._reopen = false;
            this._selectorOpen = false;
            this.lastFocusEl = false;
            this._focusEl = [ "a[href]", 'input:not([disabled]):not([type="hidden"]):not([aria-hidden])', "button:not([disabled]):not([aria-hidden])", "select:not([disabled]):not([aria-hidden])", "textarea:not([disabled]):not([aria-hidden])", "area[href]", "iframe", "object", "embed", "[contenteditable]", '[tabindex]:not([tabindex^="-"])' ];
            this.options = {
                ...config,
                ...options,
                classes: {
                    ...config.classes,
                    ...options?.classes
                },
                hashSettings: {
                    ...config.hashSettings,
                    ...options?.hashSettings
                },
                on: {
                    ...config.on,
                    ...options?.on
                }
            };
            this.bodyLock = false;
            this.options.init ? this.initPopups() : null;
        }
        initPopups() {
            this.popupLogging(`Прокинувся`);
            this.eventsPopup();
        }
        eventsPopup() {
            document.addEventListener("click", function(e) {
                const buttonOpen = e.target.closest(`[${this.options.attributeOpenButton}]`);
                if (buttonOpen) {
                    e.preventDefault();
                    if (buttonOpen.getAttribute(this.options.attributeOpenButton)) {
                        this._dataValue = buttonOpen.getAttribute(this.options.attributeOpenButton) ? buttonOpen.getAttribute(this.options.attributeOpenButton) : "error";
                        this.youTubeCode = buttonOpen.getAttribute(this.options.youtubeAttribute) ? buttonOpen.getAttribute(this.options.youtubeAttribute) : null;
                    }
                    if (this._dataValue !== "error") {
                        if (!this.isOpen) this.lastFocusEl = buttonOpen;
                        this.targetOpen.selector = `${this._dataValue}`;
                        this._selectorOpen = true;
                        this.open();
                        return;
                    } else this.popupLogging(`Йой, не заповнено атрибут у ${buttonOpen.classList}`);
                    return;
                }
                const buttonClose = e.target.closest(`[${this.options.attributeCloseButton}]`);
                if (buttonClose || !e.target.closest(`.${this.options.classes.popupContent}`) && this.isOpen) {
                    e.preventDefault();
                    this.close();
                    return;
                }
            }.bind(this));
            document.addEventListener("keydown", function(e) {
                if (this.options.closeEsc && e.which == 27 && e.code === "Escape" && this.isOpen) {
                    e.preventDefault();
                    this.close();
                    return;
                }
                if (this.options.focusCatch && e.which == 9 && this.isOpen) {
                    this._focusCatch(e);
                    return;
                }
            }.bind(this));
            if (this.options.hashSettings.goHash) {
                window.addEventListener("hashchange", function() {
                    if (window.location.hash) this._openToHash(); else this.close(this.targetOpen.selector);
                }.bind(this));
                window.addEventListener("load", function() {
                    if (window.location.hash) this._openToHash();
                }.bind(this));
            }
        }
        open(selectorValue) {
            if (bodyLockStatus) {
                this.bodyLock = document.documentElement.classList.contains("lock") && !this.isOpen ? true : false;
                if (selectorValue && typeof selectorValue === "string" && selectorValue.trim() !== "") {
                    this.targetOpen.selector = selectorValue;
                    this._selectorOpen = true;
                }
                if (this.isOpen) {
                    this._reopen = true;
                    this.close();
                }
                if (!this._selectorOpen) this.targetOpen.selector = this.lastClosed.selector;
                if (!this._reopen) this.previousActiveElement = document.activeElement;
                this.targetOpen.element = document.querySelector(this.targetOpen.selector);
                if (this.targetOpen.element) {
                    if (this.youTubeCode) {
                        const codeVideo = this.youTubeCode;
                        const urlVideo = `https://www.youtube.com/embed/${codeVideo}?rel=0&showinfo=0&autoplay=1`;
                        const iframe = document.createElement("iframe");
                        iframe.setAttribute("allowfullscreen", "");
                        const autoplay = this.options.setAutoplayYoutube ? "autoplay;" : "";
                        iframe.setAttribute("allow", `${autoplay}; encrypted-media`);
                        iframe.setAttribute("src", urlVideo);
                        if (!this.targetOpen.element.querySelector(`[${this.options.youtubePlaceAttribute}]`)) {
                            this.targetOpen.element.querySelector(".popup__text").setAttribute(`${this.options.youtubePlaceAttribute}`, "");
                        }
                        this.targetOpen.element.querySelector(`[${this.options.youtubePlaceAttribute}]`).appendChild(iframe);
                    }
                    if (this.options.hashSettings.location) {
                        this._getHash();
                        this._setHash();
                    }
                    this.options.on.beforeOpen(this);
                    document.dispatchEvent(new CustomEvent("beforePopupOpen", {
                        detail: {
                            popup: this
                        }
                    }));
                    this.targetOpen.element.classList.add(this.options.classes.popupActive);
                    document.documentElement.classList.add(this.options.classes.bodyActive);
                    if (!this._reopen) !this.bodyLock ? bodyLock() : null; else this._reopen = false;
                    this.targetOpen.element.setAttribute("aria-hidden", "false");
                    this.previousOpen.selector = this.targetOpen.selector;
                    this.previousOpen.element = this.targetOpen.element;
                    this._selectorOpen = false;
                    this.isOpen = true;
                    setTimeout((() => {
                        this._focusTrap();
                    }), 50);
                    this.options.on.afterOpen(this);
                    document.dispatchEvent(new CustomEvent("afterPopupOpen", {
                        detail: {
                            popup: this
                        }
                    }));
                    this.popupLogging(`Відкрив попап`);
                } else this.popupLogging(`Йой, такого попапу немає. Перевірте коректність введення. `);
            }
        }
        close(selectorValue) {
            if (selectorValue && typeof selectorValue === "string" && selectorValue.trim() !== "") this.previousOpen.selector = selectorValue;
            if (!this.isOpen || !bodyLockStatus) return;
            this.options.on.beforeClose(this);
            document.dispatchEvent(new CustomEvent("beforePopupClose", {
                detail: {
                    popup: this
                }
            }));
            if (this.youTubeCode) if (this.targetOpen.element.querySelector(`[${this.options.youtubePlaceAttribute}]`)) this.targetOpen.element.querySelector(`[${this.options.youtubePlaceAttribute}]`).innerHTML = "";
            this.previousOpen.element.classList.remove(this.options.classes.popupActive);
            this.previousOpen.element.setAttribute("aria-hidden", "true");
            if (!this._reopen) {
                document.documentElement.classList.remove(this.options.classes.bodyActive);
                !this.bodyLock ? bodyUnlock() : null;
                this.isOpen = false;
            }
            this._removeHash();
            if (this._selectorOpen) {
                this.lastClosed.selector = this.previousOpen.selector;
                this.lastClosed.element = this.previousOpen.element;
            }
            this.options.on.afterClose(this);
            document.dispatchEvent(new CustomEvent("afterPopupClose", {
                detail: {
                    popup: this
                }
            }));
            setTimeout((() => {
                this._focusTrap();
            }), 50);
            this.popupLogging(`Закрив попап`);
        }
        _getHash() {
            if (this.options.hashSettings.location) this.hash = this.targetOpen.selector.includes("#") ? this.targetOpen.selector : this.targetOpen.selector.replace(".", "#");
        }
        _openToHash() {
            let classInHash = document.querySelector(`.${window.location.hash.replace("#", "")}`) ? `.${window.location.hash.replace("#", "")}` : document.querySelector(`${window.location.hash}`) ? `${window.location.hash}` : null;
            if (document.querySelector(`[${this.options.attributeOpenButton} = "${classInHash}"]`)) {
                const buttons = document.querySelector(`[${this.options.attributeOpenButton} = "${classInHash}"]`) ? document.querySelector(`[${this.options.attributeOpenButton} = "${classInHash}"]`) : document.querySelector(`[${this.options.attributeOpenButton} = "${classInHash.replace(".", "#")}"]`);
                this.youTubeCode = buttons.getAttribute(this.options.youtubeAttribute) ? buttons.getAttribute(this.options.youtubeAttribute) : null;
                if (buttons && classInHash) this.open(classInHash);
            }
        }
        _setHash() {
            history.pushState("", "", this.hash);
        }
        _removeHash() {
            history.pushState("", "", window.location.href.split("#")[0]);
        }
        _focusCatch(e) {
            const focusable = this.targetOpen.element.querySelectorAll(this._focusEl);
            const focusArray = Array.prototype.slice.call(focusable);
            const focusedIndex = focusArray.indexOf(document.activeElement);
            if (e.shiftKey && focusedIndex === 0) {
                focusArray[focusArray.length - 1].focus();
                e.preventDefault();
            }
            if (!e.shiftKey && focusedIndex === focusArray.length - 1) {
                focusArray[0].focus();
                e.preventDefault();
            }
        }
        _focusTrap() {
            const focusable = this.previousOpen.element.querySelectorAll(this._focusEl);
            if (!this.isOpen && this.lastFocusEl) this.lastFocusEl.focus(); else focusable[0].focus();
        }
        popupLogging(message) {
            this.options.logging ? functions_FLS(`[Попапос]: ${message}`) : null;
        }
    }
    modules_flsModules.popup = new Popup({});
    function formQuantity() {
        document.addEventListener("click", (function(e) {
            let targetElement = e.target;
            if (targetElement.closest("[data-quantity-plus]") || targetElement.closest("[data-quantity-minus]")) {
                const valueElement = targetElement.closest("[data-quantity]").querySelector("[data-quantity-value]");
                let value = parseInt(valueElement.value);
                if (targetElement.hasAttribute("data-quantity-plus")) {
                    value++;
                    if (+valueElement.dataset.quantityMax && +valueElement.dataset.quantityMax < value) value = valueElement.dataset.quantityMax;
                } else {
                    --value;
                    if (+valueElement.dataset.quantityMin) {
                        if (+valueElement.dataset.quantityMin > value) value = valueElement.dataset.quantityMin;
                    } else if (value < 1) value = 1;
                }
                targetElement.closest("[data-quantity]").querySelector("[data-quantity-value]").value = value;
            }
        }));
    }
    let addWindowScrollEvent = false;
    setTimeout((() => {
        if (addWindowScrollEvent) {
            let windowScroll = new Event("windowScroll");
            window.addEventListener("scroll", (function(e) {
                document.dispatchEvent(windowScroll);
            }));
        }
    }), 0);
    class Toast {
        constructor(t) {
            this._title = !1 !== t.title && (t.title || "Title"), this._text = t.text || "Message...", 
            this._theme = t.theme || "default", this._autohide = t.autohide && !0, this._interval = +t.interval || 5e3, 
            this._create(), this._el.addEventListener("click", (t => {
                t.target.classList.contains("toast__close") && this._hide();
            })), this._show();
        }
        _show() {
            this._el.classList.add("toast_showing"), this._el.classList.add("toast_show"), window.setTimeout((() => {
                this._el.classList.remove("toast_showing");
            })), this._autohide && setTimeout((() => {
                this._hide();
            }), this._interval);
        }
        _hide() {
            this._el.classList.add("toast_showing"), this._el.addEventListener("transitionend", (() => {
                this._el.classList.remove("toast_showing"), this._el.classList.remove("toast_show"), 
                this._el.remove();
            }), {
                once: !0
            });
            const t = new CustomEvent("hide.toast", {
                detail: {
                    target: this._el
                }
            });
            document.dispatchEvent(t);
        }
        _create() {
            const t = document.createElement("div");
            t.classList.add("toast"), t.classList.add(`toast_${this._theme}`);
            let e = '{header}<div class="toast__body"></div><button class="toast__close" type="button"></button>';
            const s = !1 === this._title ? "" : '<div class="toast__header"></div>';
            if (e = e.replace("{header}", s), t.innerHTML = e, this._title ? t.querySelector(".toast__header").textContent = this._title : t.classList.add("toast_message"), 
            t.querySelector(".toast__body").textContent = this._text, this._el = t, !document.querySelector(".toast-container")) {
                const t = document.createElement("div");
                t.classList.add("toast-container"), document.body.append(t);
            }
            document.querySelector(".toast-container").append(this._el);
        }
    }
    function showNotification(title, text, status) {
        new Toast({
            title,
            text,
            theme: status,
            autohide: true,
            interval: 4e3
        });
    }
    //showNotification("Упс... Ошибка", "Недостаточно средств", "error");
   // showNotification("Ваш выигрыш:", "$ 152544", "success");
    const gameHistoryClipboardInput = document.querySelector(".header-actions__gameinfo-clipboard-text");
    const gameHistoryClipboardBtn = document.querySelector(".header-actions__gameinfo-clipboard-button");
    const popupTableGameInfoClipboardInput = document.querySelector(".popup-game-info__table-clipboard-text");
    const popupTableGameInfoClipboardBtn = document.querySelector(".popup-game-info__table-clipboard-button");
    const popupGameInfoClipboardInput = document.querySelector(".popup-game-info__clipboard-text");
    const popupGameInfoClipboardBtn = document.querySelector(".popup-game-info__clipboard-button");
    function clipboard(btn, input) {
        if (btn) btn.addEventListener("click", (function(e) {
            const str = input.innerHTML;
            const el = document.createElement("textarea");
            el.value = str;
            el.setAttribute("readonly", "");
            el.style.position = "absolute";
            el.style.left = "-9999px";
            document.body.appendChild(el);
            el.select();
            document.execCommand("copy");
            document.body.removeChild(el);
            alert(`Copied: ${str}`);
        }));
    }
    function menusShowHide() {
        if (document.querySelector(".game-screen__players-btn")) document.documentElement.classList.add("players-show");
        document.addEventListener("click", (function(e) {
            if (e.target.closest(".header-balance")) {
                document.documentElement.classList.toggle("balance-show");
                document.documentElement.classList.remove("game-info-show");
            }
            if (e.target.closest(".header-actions__info")) {
                document.documentElement.classList.remove("balance-show");
                document.documentElement.classList.toggle("game-info-show");
            }
            if (e.target.closest(".game-screen__players-btn")) document.documentElement.classList.toggle("players-show");
            if (e.target.closest(".header-actions__gameinfo-clipboard-button")) clipboard(gameHistoryClipboardBtn, gameHistoryClipboardInput);
            if (e.target.closest(".popup-game-info__table-clipboard-button")) clipboard(popupTableGameInfoClipboardBtn, popupTableGameInfoClipboardInput);
            if (e.target.closest(".popup-game-info__clipboard-button")) clipboard(popupGameInfoClipboardBtn, popupGameInfoClipboardInput);
        }));
    }
    menusShowHide();
    document.querySelectorAll(".checkbox");
    const checboxInput = document.querySelectorAll(".checkbox__input");
    for (let i = 0; i < checboxInput.length; i++) {
        const input = checboxInput[i];
        if (input.hasAttribute("checked")) input.closest("div").classList.add("active");
    }
    document.addEventListener("click", (function(e) {
        if (e.target.classList.contains("checkbox")) {
            if (e.target.firstElementChild.hasAttribute("checked")) e.target.firstElementChild.removeAttribute("checked"); else e.target.firstElementChild.setAttribute("checked", true);
            e.target.classList.toggle("active");
        }
    }));
    const gameInfoVolumeButton = document.querySelector(".header-actions__volume");
    if (gameInfoVolumeButton) gameInfoVolumeButton.addEventListener("click", (function(e) {
        gameInfoVolumeButton.classList.toggle("_muted");
    }));
    const actionsGameRatesQuantityButton = document.querySelectorAll(".actions-game-rates__input-button");
    if (actionsGameRatesQuantityButton.length > 0) actionsGameRatesQuantityButton.forEach((btn => {
        btn.addEventListener("click", (function(e) {
            let input = btn.parentElement.firstElementChild;
            let inputValue;
            if (input.value) inputValue = parseInt(input.value); else inputValue = 0;
            inputValue += Number(btn.getAttribute("data-quantity-button"));
            input.value = inputValue;
        }));
    }));
	

    function showPopupHtml(popupId, popupClass, popupType, popupHtml) {
        let popupTemplate;
        if (popupType == "default") popupTemplate = `\n\t\t<div id='${popupId}' aria-hidden="true" class="popup popup-default ${popupClass}">\n\t\t\t<div class="popup__wrapper">\n\t\t\t\t<div class="popup__content">\n\t\t\t\t<button data-close type="button" class="popup__close">\n\t\t\t\t\t<svg width="800px" height="800px" viewBox="0 -0.5 25 25" fill="none" xmlns="http://www.w3.org/2000/svg">\n\t\t\t\t\t\t<path\n\t\t\t\t\t\t\td="M6.96967 16.4697C6.67678 16.7626 6.67678 17.2374 6.96967 17.5303C7.26256 17.8232 7.73744 17.8232 8.03033 17.5303L6.96967 16.4697ZM13.0303 12.5303C13.3232 12.2374 13.3232 11.7626 13.0303 11.4697C12.7374 11.1768 12.2626 11.1768 11.9697 11.4697L13.0303 12.5303ZM11.9697 11.4697C11.6768 11.7626 11.6768 12.2374 11.9697 12.5303C12.2626 12.8232 12.7374 12.8232 13.0303 12.5303L11.9697 11.4697ZM18.0303 7.53033C18.3232 7.23744 18.3232 6.76256 18.0303 6.46967C17.7374 6.17678 17.2626 6.17678 16.9697 6.46967L18.0303 7.53033ZM13.0303 11.4697C12.7374 11.1768 12.2626 11.1768 11.9697 11.4697C11.6768 11.7626 11.6768 12.2374 11.9697 12.5303L13.0303 11.4697ZM16.9697 17.5303C17.2626 17.8232 17.7374 17.8232 18.0303 17.5303C18.3232 17.2374 18.3232 16.7626 18.0303 16.4697L16.9697 17.5303ZM11.9697 12.5303C12.2626 12.8232 12.7374 12.8232 13.0303 12.5303C13.3232 12.2374 13.3232 11.7626 13.0303 11.4697L11.9697 12.5303ZM8.03033 6.46967C7.73744 6.17678 7.26256 6.17678 6.96967 6.46967C6.67678 6.76256 6.67678 7.23744 6.96967 7.53033L8.03033 6.46967ZM8.03033 17.5303L13.0303 12.5303L11.9697 11.4697L6.96967 16.4697L8.03033 17.5303ZM13.0303 12.5303L18.0303 7.53033L16.9697 6.46967L11.9697 11.4697L13.0303 12.5303ZM11.9697 12.5303L16.9697 17.5303L18.0303 16.4697L13.0303 11.4697L11.9697 12.5303ZM13.0303 11.4697L8.03033 6.46967L6.96967 7.53033L11.9697 12.5303L13.0303 11.4697Z"\n\t\t\t\t\t\t\tfill="#5ea7de" />\n\t\t\t\t\t</svg>\n\t\t\t\t</button>\n\t\t\t\t${popupHtml}\n\t\t\t\t</div>\n\t\t\t</div>\n\t\t</div>`;
        document.querySelector(".wrapper").insertAdjacentHTML("afterend", popupTemplate);
        modules_flsModules.popup.open(`#${popupId}`);
    }
	
	
	function showGameInfo(game_id , date_end , salt, result, hash) {
        let hash_short = hash.substr(0, 10) + '****' + hash.substr(-10);
		showPopupHtml("popup-game-info", "popup-game-info", "default", `<h2 class="popup-game-info__title">Игра ${game_id}</h2>\n<div class="popup-game-info__time">Время завершения <span>${date_end}</span></div>\n<h2 class="popup-game-info__title">Честная игра</h2>\n<div class="popup-game-info__table">\n\t<div class="popup-game-info__table-row">\n\t\tСоль:\n\t\t<span>${salt}</span>\n\t</div>\n\t<div class="popup-game-info__table-row">\n\t\tФинальный результат\n\t\t<span>${result}</span>\n\t</div>\n\t<div class="popup-game-info__table-row">\n\t\tХеш игры\n\t\t<span class="popup-game-info__table-clipboard-text clipboard-copy" data-copy_val="${hash}">${hash_short}</span>\n\t\t<button type="button" class="popup-game-info__table-clipboard-button clipboard-button">\n\t\t\t<img src="/assets/jetgram_UI/img/icons/clipboard.svg" alt="иконка копирования">\n\t\t</button>\n\t</div>\n</div>\n<h3 class="popup-game-info__subtitle">Строка для хэширования:</h3>\n<div class="popup-game-info__table-row" style="justify-content: center">\n\t<span class="popup-game-info__table-clipboard-text clipboard-copy" data-copy_val="${game_id}--${salt}--${result}">${game_id}--${salt}--${result}</span>\n\t<button type="button" class="popup-game-info__clipboard-button clipboard-button" style="position:absolute; right:0; transform: translate(-100%,0)">\n\t\t<img src="/assets/jetgram_UI/img/icons/clipboard.svg" alt="иконка копирования">\n\t</button>\n</div>`);
	}
	
	
    let tg = window.Telegram.WebApp;
    tg.expand();
    if (isMobile.any()) if (document.querySelector(".turn-to-portrait")) document.querySelector(".turn-to-portrait").classList.add("show");
    var animateButton = function(e) {
        console.log(e);
        // e.preventDefault;
        e.target.classList.remove("animate");
        e.target.classList.add("animate");
        setTimeout((function() {
            e.target.classList.remove("animate");
        }), 700);
        e.stopPropagation();
    };
	
	
	/*
    var bubblyButton1 = document.querySelector(".actions-game-rates__button");
    var bubblyButton2 = document.querySelector(".actions-game-cashout");
    
	if (bubblyButton1) bubblyButton1.addEventListener("click", animateButton, true);
    if (bubblyButton2) bubblyButton2.addEventListener("click", (function(e) {
        e.preventDefault;
        e.target.closest(".actions-game-cashout").classList.remove("animate");
        e.target.closest(".actions-game-cashout").classList.add("animate");
        setTimeout((function() {
            e.target.closest(".actions-game-cashout").classList.remove("animate");
        }), 700);
    }), true);
	
	*/
	

    window["FLS"] = false;
    isWebp();
    formQuantity();
	
	
// })();
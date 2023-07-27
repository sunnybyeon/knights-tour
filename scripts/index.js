import { Board } from "./lib/board.js";
import { getTranslations } from "./lib/localize.js";

getTranslations().then((translations) => {
    document.title = translations.title;
    document.querySelector("article.description > h1").textContent =
        translations.title;
    document
        .querySelector("article.description > blockquote")
        .replaceChildren();
    document
        .querySelector("article.description > blockquote")
        .insertAdjacentHTML("afterbegin", translations.description);
    document.querySelector("article.description cite > a").textContent =
        translations.descriptionSource;
    /** @type {HTMLAnchorElement} */ (document.querySelector("cite > a")).href =
        translations.descriptionSourceURL;
    document
        .querySelector("article.description > blockquote")
        .setAttribute("cite", translations.descriptionSourceURL);
    document.querySelector("article.message-box > h1").textContent =
        translations.messageBoxTitle;
    document.querySelector("div.default-message").textContent =
        translations.defaultMessage;
    document.querySelector("div.solved-message").textContent =
        translations.solvedMessage;
    document.querySelector("div.failed-message").textContent =
        translations.failedMessage;
    document.querySelector("div.wrong-board-size-message").textContent =
        translations.wrongBoardSizeMessage;
    document.querySelector("label[for=board-size]").textContent =
        translations.boardSizeLabel;
    document.querySelector("article.controls button").textContent =
        translations.resetBoardButton;
    document.querySelector("label[for=show-hints]").textContent =
        translations.showHintsLabel;
});

/**
 * Changes the message on the message box.
 * @param {string} messageClass The class of the message to show.
 */
function changeMessage(messageClass) {
    document
        .querySelector("article.message-box")
        .querySelectorAll("div")
        .forEach((message) => {
            message.style.display = "none";
        });
    /** @type {HTMLDivElement} */ (
        document.querySelector(`div.${messageClass}`)
    ).style.display = "block";
}

const board = new Board(6, true);
board.attach(document.getElementsByTagName("main")[0]);
board.element.addEventListener("click", () => {
    if (board.state !== Board.STATE.UNFINISHED) {
        setTimeout(() => {
            changeMessage("default-message");
        }, 3000);
    }
    if (board.state === Board.STATE.SOLVED) {
        changeMessage("solved-message");
    } else if (board.state === Board.STATE.FAILED) {
        changeMessage("failed-message");
        setTimeout(() => {
            board.reset();
        }, 1000);
    }
});

document.getElementsByName("reset-board")[0].addEventListener("click", () => {
    const size = Number(
        /** @type {HTMLInputElement} */ (
            document.getElementsByName("board-size")[0]
        ).value
    );
    if (size <= 4) {
        changeMessage("wrong-board-size-message");
        setTimeout(() => {
            changeMessage("default-message");
        }, 3000);
    } else {
        board.reset(size);
    }
});
document.getElementsByName("show-hints")[0].addEventListener("click", () => {
    board.showHints = /** @type {HTMLInputElement} */ (
        document.getElementsByName("show-hints")[0]
    ).checked;
});

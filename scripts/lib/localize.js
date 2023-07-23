/**
 * The object containing the translations.
 * @typedef {Object} translations
 * @property {string} title The title of the document.
 * @property {string} description The description for the knight's tour in HTML.
 * @property {string} descriptionSource The source of the description.
 * @property {string} descriptionSourceURL The URL to the description source.
 * @property {string} messageBoxTitle The title of the message box.
 * @property {string} defaultMessage The default message to show on the message box.
 * @property {string} solvedMessage The message to show on the message box when the board is solved.
 * @property {string} failedMessage The message to show on the message box when the user failed to solve the board.
 * @property {string} wrongBoardSizeMessage The message to show on the message box when the board size isn't set correctly.
 * @property {string} boardSizeLabel The label for the board size configuration.
 * @property {string} resetBoardButton The label for the reset button.
 * @property {string} showHintsLabel The label for the show hints configuration.
 */

/**
 * Gets the translations for the page. The language defaults to English if there are no translations available for any of the perfered languages.
 * @param {Array<string>} [languages] The prefered languages in order of perference. Defaults to navigator.languages.
 * @returns {Promise<translations>} The translations.
 */
export async function getTranslations(languages = [...navigator.languages]) {
    for (const language of languages) {
        const translations = await fetch(
            new URL(
                `../../translations/${language.split("-")[0]}.json`,
                import.meta.url
            )
        ).then((res) => (res.status === 400 ? null : res.json()));
        if (translations) {
            return translations;
        }
    }
    return fetch(new URL(`../translations/en.json`, import.meta.url)).then(
        (res) => res.json()
    );
}

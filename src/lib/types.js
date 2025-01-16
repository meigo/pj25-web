/**
 * @typedef {"et"|"en"} Language
 */

/**
 * @typedef {"artists"|"info"|"schedule"|"ticket"|"mail"|undefined} Icons
 */

/**
 * @typedef {Object} PictureData
 * @property {{type:string, srcset:string}[]} sources
 * @property {{src:string, alt:string, w:number, h:number}} img
 */

/**
 * @typedef {Object} PictureData2
 * @property {{[key: string]: string}} sources
 * @property {{src:string, alt:string, w:number, h:number}} img
 */

/**
 * @typedef {Object} SiteData
 * @property {string} base
 * @property {string} [title]
 * @property {string} [description]
 * @property {string[]} [keywords]
 * @property {string} [ogImage]
 */

/**
 * @typedef {Object} MenuItem
 * @property {string} title
 * @property {string} target
 * @property {string} url
 */

/**
 * @typedef {Record<string, MenuItem>} MenuData
 */

/**
 * @typedef {Object} ArtistData
 * @property {string} name
 * @property {string} slug
 * @property {string} [country]
 * @property {Date} date
 * @property {"pealava" | "rannalava" | "dj"} stage
 * @property {PictureData} [picture]
 * @property {string} [video_id]
 */

/**
 * @typedef {Object} ArtistsSectionData
 * @property {string} [title]
 * @property {string} [text]
 * @property {ArtistData[]} [artists]
 */

/**
 * @typedef {Object} InfoSectionData
 * @property {string} [title]
 * @property {*} [text]
 * @property {*} [html]
 */

/**
 * @typedef {Object} ScheduleSectionData
 * @property {string} [title]
 * @property {string[]} [text]
 */

/**
 * @typedef {Object} ImageSectionData
 * @property {PictureData[]} [section1]
 * @property {PictureData[]} [section2]
 */

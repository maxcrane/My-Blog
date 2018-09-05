const sitemap = require('sitemap');
const articleUtils = require("../src/app/utils/articleUtils");
const hostname = 'https://www.maxcrane.org';
const cacheTime = 300000;
const changefreq = 'weekly';
let defaultBlogUrls = [{url: '/about', changefreq},
    {url: '/articles', changefreq}];
const _ = require('lodash');
let blogSitemap = sitemap.createSitemap({hostname, cacheTime, urls: defaultBlogUrls});

const convertToSitemapUrl = (article) => {
    return {url: `/${article.url}`, changefreq};
};

const convertToSitemapUrls = (articles) => {
    return Promise.resolve(_.values(articles).map(convertToSitemapUrl));
};

const applySitemapUpdate = (newArticleUrls) => {
    blogSitemap = sitemap.createSitemap({
        hostname,
        cacheTime,
        urls: defaultBlogUrls.concat(newArticleUrls)
    });
};

const updateSitemap = () => {
    articleUtils.getArticles()
        .then(convertToSitemapUrls)
        .then(applySitemapUpdate)
        .catch(console.log.bind(this))

    //TODO: Use .finally (looks like its not in node 6)
    setTimeout(updateSitemap, 300000);
};

const getSitemap = () => {
    return blogSitemap.toString();
};


updateSitemap();

module.exports = {
    getSitemap
};
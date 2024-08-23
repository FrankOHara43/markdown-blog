const mongoose = require('mongoose');
const { marked } = require('marked'); // Correct import for marked@14.0.0
const slugify = require('slugify');
const createDomPurify = require('dompurify');
const { JSDOM } = require('jsdom');
const dompurify = createDomPurify(new JSDOM().window);

const articleSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String
  },
  markdown: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  slug: {
    type: String,
    required: true,
    unique: true
  },
  html: {
    type: String
  },
  sanitizedHtml: {
    type: String
  }
});

// Pre-validate hook to set slug and sanitized HTML
articleSchema.pre('validate', function(next) {
  if (this.title) {
    this.slug = slugify(this.title, { lower: true, strict: true });
  }

  if (this.markdown) {
    // Convert markdown to HTML
    const htmlContent = marked(this.markdown);
    // Sanitize HTML
    this.sanitizedHtml = dompurify.sanitize(htmlContent);
  }

  next();
});

module.exports = mongoose.model('Article', articleSchema);

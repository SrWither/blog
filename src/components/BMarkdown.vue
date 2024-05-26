<script setup lang="ts">
import { ref, watch } from 'vue'
import { Marked } from 'marked'
import { markedHighlight } from 'marked-highlight'
import hljs from 'highlight.js'
import * as emoji from 'node-emoji'
import 'highlight.js/styles/atom-one-light.css'

const props = defineProps<{ content: string }>()
const emits = defineEmits(['clickImage'])

const renderedContent = ref<string>('')

// Initialize Marked instance with custom settings for syntax highlighting
const marked = new Marked(
  markedHighlight({
    langPrefix: 'hljs language-',
    highlight(code, lang) {
      const language = hljs.getLanguage(lang) ? lang : 'txt'
      return hljs.highlight(code, { language }).value
    }
  })
)

// Custom renderer for handling YouTube video links in markdown
marked.use({
  renderer: {
    link(href, title, text) {
      const youtubeMatch = href.match(
        /(?:youtube\.com\/(?:[^/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?/ ]{11})/
      )
      if (youtubeMatch) {
        const videoId = youtubeMatch[1]
        return `
        <div class="youtube">
          <iframe class="youtube-iframe" src="https://www.youtube.com/embed/${videoId}" frameborder="0" allowfullscreen></iframe>
        </div>
      `
      }
      return `<a href="${href}" title="${title}" target="_blank">${text}</a>`
    }
  }
})

// Function to render markdown content using Marked and emoji conversion
const renderMarkdown = (markdown: string) => {
  return marked.parse(emoji.emojify(markdown))
}

// Event handler to handle click events on images within rendered content
const handleClick = (event: MouseEvent) => {
  if (event.target instanceof HTMLImageElement) {
    const parentElement = event.target.parentElement

    if (!(parentElement instanceof HTMLAnchorElement && parentElement.href)) {
      event.preventDefault()
      emits('clickImage', event.target.src)
    }
  }
}

// Watch for changes in props.content and update renderedContent accordingly
watch(
  () => props.content,
  async (newContent) => {
    renderedContent.value = await renderMarkdown(newContent)
  },
  { immediate: true }
)
</script>

<template>
  <div
    id="post-content"
    class="dark:text-white"
    v-html="renderedContent"
    @click="handleClick"
  ></div>
</template>

<style>
#post-content {
  /* font-family: 'Arial', sans-serif; */
  line-height: 1.6;
}
#post-content h1 {
  font-size: 1.8em;
  font-weight: 700;
  margin-bottom: 0.5em;
}

#post-content h2 {
  font-size: 1.6em;
  font-weight: 700;
  margin-bottom: 0.4em;
}

#post-content h3 {
  font-size: 1.4em;
  margin-bottom: 0.3em;
}

#post-content h4 {
  font-size: 1.2em;
  margin-bottom: 0.2em;
}

#post-content h5 {
  font-size: 1em; /* Mismo tamaño */
  margin-bottom: 0.1em;
}

#post-content h6 {
  font-size: 0.9em;
  margin-bottom: 0.1em;
}

#post-content p {
  font-size: 0.95em;
  margin-bottom: 0.8em;
}

#post-content a {
  font-size: 0.95em;
  color: #0366d6;
  text-decoration: underline;
}

#post-content pre {
  padding: 1rem 0;
}

#post-content code {
  font-size: 0.85em;
  border-radius: 1rem;
  padding: 0.5rem;
  background-color: #f1f1f1;
}

#post-content code * {
  font-family: 'Droid Sans Mono', sans-serif;
}

.dark #post-content code {
  background-color: #2d2d2d;
  color: #e1e1e1;
}

#post-content img {
  max-width: 100%;
  height: auto;
  display: block;
  margin: 1em auto;
  border-radius: 0.5rem;
  filter: drop-shadow(0 4px 6px rgba(0, 0, 0, 0.2));
}

#post-content table {
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 1.6em;
  border: 1px solid #ddd;
}

#post-content th,
#post-content td {
  padding: 0.8em;
  border: 1px solid #ddd;
  text-align: left;
  font-size: 0.95em;
}

#post-content th {
  background-color: #f8f8f8;
  font-weight: bold;
}

#post-content tr:nth-child(even) {
  background-color: #f2f2f2;
}

/* #post-content tr:hover {
  background-color: #e9e9e9;
} */

#post-content table caption {
  caption-side: bottom;
  font-size: 0.9em;
  color: #666;
  margin-top: 0.5em;
  text-align: center;
}

.dark #post-content table {
  border: 1px solid #444;
}

.dark #post-content th,
.dark #post-content td {
  border: 1px solid #444;
}

.dark #post-content th {
  background-color: #444;
  color: #ddd;
}

.dark #post-content tr:nth-child(even) {
  background-color: #333;
}

/* .dark #post-content tr:hover {
  background-color: #444;
} */

.dark #post-content table caption {
  color: #aaa;
}

#post-content ul,
#post-content ol {
  margin-bottom: 1.6em;
  padding-left: 1.5em;
}

#post-content ul {
  list-style-type: disc;
}

#post-content ul ul {
  list-style-type: circle;
}

#post-content ul ul ul {
  list-style-type: square;
}

#post-content ol {
  list-style-type: decimal;
}

#post-content ol ol {
  list-style-type: lower-alpha;
}

#post-content ol ol ol {
  list-style-type: lower-roman;
}

.dark #post-content ul,
.dark #post-content ol {
  margin-bottom: 1.6em;
  padding-left: 1.5em;
}

.dark #post-content ul {
  list-style-type: disc;
}

.dark #post-content ul ul {
  list-style-type: circle;
}

.dark #post-content ul ul ul {
  list-style-type: square;
}

.dark #post-content ol {
  list-style-type: decimal;
}

.dark #post-content ol ol {
  list-style-type: lower-alpha;
}

.dark #post-content ol ol ol {
  list-style-type: lower-roman;
}

#post-content blockquote {
  margin: 0 0 1.6em;
  padding: 0.5em 1em;
  background-color: #f9f9f9;
  border-left: 4px solid #ccc;
}

#post-content blockquote p {
  margin: 0.8em 0;
}

.dark #post-content blockquote {
  background-color: #333;
  color: #ddd;
  border-left-color: #999;
}

#post-content details {
  margin-bottom: 1.6em;
}

#post-content summary {
  cursor: pointer;
  outline: none;
  font-weight: bold;
  margin-bottom: 0.5em;
}

#post-content details[open] summary {
  color: #0366d6;
}

.dark #post-content summary {
  color: #6cb6ff;
}

.dark #post-content details[open] summary {
  color: #9ac0ff;
}

/* #post-content details[open] {
} */

#post-content .youtube {
  position: relative;
  width: 100%;
  height: 0;
  padding-bottom: 56.25%;
  margin-bottom: 1rem;
}

#post-content .youtube-iframe {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  border-radius: 0.5rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.2);
}
</style>

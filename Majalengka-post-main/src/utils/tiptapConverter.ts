export interface TiptapMark {
  type: "bold" | "italic" | "underline" | "strike" | "textStyle" | "highlight" | "link";
  attrs?: Record<string, any>;
}

export interface TiptapNode {
  type: string;
  attrs?: Record<string, any>;
  content?: TiptapNode[];
  text?: string;
  marks?: TiptapMark[];
}

export interface TiptapDoc {
  type: "doc";
  content: TiptapNode[];
}

/**
 * Parses an HTML string into a ProseMirror/Tiptap-compatible JSON document structure.
 */
export function htmlToTiptapJson(html: string): TiptapDoc {
  if (typeof window === "undefined") {
    return { type: "doc", content: [] };
  }

  const parser = new DOMParser();
  const doc = parser.parseFromString(html || "<p></p>", "text/html");
  const body = doc.body;

  const content: TiptapNode[] = [];

  const parseInlineNodes = (element: Element | ChildNode): TiptapNode[] => {
    const inlineNodes: TiptapNode[] = [];

    element.childNodes.forEach((child) => {
      if (child.nodeType === Node.TEXT_NODE) {
        const textContent = child.textContent || "";
        if (textContent) {
          inlineNodes.push({
            type: "text",
            text: textContent,
          });
        }
      } else if (child.nodeType === Node.ELEMENT_NODE) {
        const el = child as Element;
        const tag = el.tagName.toLowerCase();

        // Recursively gather children text and marks
        const childInlineNodes = parseInlineNodes(el);

        // Apply marks based on styling tags
        let currentMark: TiptapMark | null = null;
        if (tag === "strong" || tag === "b") {
          currentMark = { type: "bold" };
        } else if (tag === "em" || tag === "i") {
          currentMark = { type: "italic" };
        } else if (tag === "u") {
          currentMark = { type: "underline" };
        } else if (tag === "s" || tag === "strike" || tag === "del") {
          currentMark = { type: "strike" };
        } else if (tag === "a") {
          currentMark = {
            type: "link",
            attrs: {
              href: el.getAttribute("href") || "",
              target: el.getAttribute("target") || "_blank",
            },
          };
        } else if (tag === "span") {
          const color = el.getAttribute("data-color") || (el as HTMLElement).style.color;
          const bg = el.getAttribute("data-highlight") || (el as HTMLElement).style.backgroundColor;
          if (color) {
            currentMark = { type: "textStyle", attrs: { color } };
          } else if (bg) {
            currentMark = { type: "highlight", attrs: { color: bg } };
          }
        }

        childInlineNodes.forEach((node) => {
          if (node.type === "text") {
            const marks = node.marks ? [...node.marks] : [];
            if (currentMark) marks.push(currentMark);
            inlineNodes.push({
              ...node,
              marks: marks.length > 0 ? marks : undefined,
            });
          } else {
            inlineNodes.push(node);
          }
        });
      }
    });

    return inlineNodes;
  };

  body.childNodes.forEach((child) => {
    if (child.nodeType !== Node.ELEMENT_NODE) return;
    const el = child as Element;
    const tag = el.tagName.toLowerCase();

    if (tag.match(/^h[1-6]$/)) {
      const level = parseInt(tag.charAt(1));
      content.push({
        type: "heading",
        attrs: { level },
        content: parseInlineNodes(el),
      });
    } else if (tag === "blockquote") {
      content.push({
        type: "blockquote",
        content: parseInlineNodes(el),
      });
    } else if (tag === "pre" || tag === "code") {
      content.push({
        type: "codeBlock",
        content: [{ type: "text", text: el.textContent || "" }],
      });
    } else if (tag === "ul") {
      const listItems: TiptapNode[] = [];
      el.querySelectorAll("li").forEach((li) => {
        listItems.push({
          type: "listItem",
          content: parseInlineNodes(li),
        });
      });
      content.push({
        type: "bulletList",
        content: listItems,
      });
    } else if (tag === "ol") {
      const listItems: TiptapNode[] = [];
      el.querySelectorAll("li").forEach((li) => {
        listItems.push({
          type: "listItem",
          content: parseInlineNodes(li),
        });
      });
      content.push({
        type: "orderedList",
        content: listItems,
      });
    } else if (tag === "hr") {
      content.push({
        type: "horizontalRule",
      });
    } else if (tag === "img") {
      content.push({
        type: "image",
        attrs: {
          src: el.getAttribute("src") || "",
          alt: el.getAttribute("alt") || "",
          caption: el.getAttribute("data-caption") || "",
        },
      });
    } else if (tag === "iframe" && el.getAttribute("src")?.includes("youtube")) {
      content.push({
        type: "youtube",
        attrs: {
          src: el.getAttribute("src") || "",
        },
      });
    } else if (tag === "video") {
      content.push({
        type: "video",
        attrs: {
          src: el.getAttribute("src") || "",
        },
      });
    } else if (tag === "table") {
      const rows: TiptapNode[] = [];
      el.querySelectorAll("tr").forEach((tr) => {
        const cells: TiptapNode[] = [];
        tr.querySelectorAll("td, th").forEach((cell) => {
          cells.push({
            type: cell.tagName.toLowerCase() === "th" ? "tableHeader" : "tableCell",
            content: parseInlineNodes(cell),
          });
        });
        rows.push({
          type: "tableRow",
          content: cells,
        });
      });
      content.push({
        type: "table",
        content: rows,
      });
    } else {
      // Default to paragraph
      content.push({
        type: "paragraph",
        content: parseInlineNodes(el),
      });
    }
  });

  if (content.length === 0) {
    content.push({
      type: "paragraph",
      content: [],
    });
  }

  return {
    type: "doc",
    content,
  };
}

/**
 * Renders a Tiptap JSON document structure back into clean HTML format.
 */
export function tiptapJsonToHtml(doc: TiptapDoc | null | undefined): string {
  if (!doc || !doc.content) return "";

  const renderMarks = (text: string, marks?: TiptapMark[]): string => {
    if (!marks || marks.length === 0) return text;
    let html = text;

    marks.forEach((mark) => {
      if (mark.type === "bold") {
        html = `<strong>${html}</strong>`;
      } else if (mark.type === "italic") {
        html = `<em>${html}</em>`;
      } else if (mark.type === "underline") {
        html = `<u>${html}</u>`;
      } else if (mark.type === "strike") {
        html = `<s>${html}</s>`;
      } else if (mark.type === "link") {
        html = `<a href="${mark.attrs?.href || "#"}" target="${mark.attrs?.target || "_blank"}" class="text-red-600 hover:underline">${html}</a>`;
      } else if (mark.type === "textStyle" && mark.attrs?.color) {
        html = `<span style="color: ${mark.attrs.color}">${html}</span>`;
      } else if (mark.type === "highlight" && mark.attrs?.color) {
        html = `<span style="background-color: ${mark.attrs.color}">${html}</span>`;
      }
    });

    return html;
  };

  const renderInlineNodes = (nodes?: TiptapNode[]): string => {
    if (!nodes) return "";
    return nodes
      .map((node) => {
        if (node.type === "text") {
          return renderMarks(node.text || "", node.marks);
        }
        return "";
      })
      .join("");
  };

  return doc.content
    .map((node) => {
      switch (node.type) {
        case "heading":
          const level = node.attrs?.level || 1;
          return `<h${level}>${renderInlineNodes(node.content)}</h${level}>`;
        case "blockquote":
          return `<blockquote>${renderInlineNodes(node.content)}</blockquote>`;
        case "codeBlock":
          return `<pre><code>${node.content?.[0]?.text || ""}</code></pre>`;
        case "bulletList":
          const ulist = node.content
            ?.map((li) => `<li>${renderInlineNodes(li.content)}</li>`)
            .join("") || "";
          return `<ul>${ulist}</ul>`;
        case "orderedList":
          const olist = node.content
            ?.map((li) => `<li>${renderInlineNodes(li.content)}</li>`)
            .join("") || "";
          return `<ol>${olist}</ol>`;
        case "horizontalRule":
          return "<hr />";
        case "image":
          const src = node.attrs?.src || "";
          const alt = node.attrs?.alt || "";
          const cap = node.attrs?.caption || "";
          return `
            <figure class="my-6">
              <img src="${src}" alt="${alt}" class="rounded-lg w-full" />
              ${cap ? `<figcaption class="text-xs text-gray-500 mt-2 text-center">${cap}</figcaption>` : ""}
            </figure>
          `;
        case "youtube":
          const ysrc = node.attrs?.src || "";
          return `
            <div class="my-6 aspect-video">
              <iframe src="${ysrc}" class="w-full h-full rounded-lg" allowfullscreen></iframe>
            </div>
          `;
        case "video":
          const vsrc = node.attrs?.src || "";
          return `
            <div class="my-6">
              <video src="${vsrc}" controls class="w-full rounded-lg"></video>
            </div>
          `;
        case "table":
          const rows = node.content
            ?.map((tr) => {
              const cells = tr.content
                ?.map((cell) => {
                  const tag = cell.type === "tableHeader" ? "th" : "td";
                  return `<${tag} class="border border-gray-300 dark:border-gray-700 p-2">${renderInlineNodes(cell.content)}</${tag}>`;
                })
                .join("") || "";
              return `<tr>${cells}</tr>`;
            })
            .join("") || "";
          return `<table class="w-full border-collapse my-4">${rows}</table>`;
        case "paragraph":
        default:
          return `<p>${renderInlineNodes(node.content)}</p>`;
      }
    })
    .join("\n");
}

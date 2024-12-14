const iframe = document.querySelector("iframe");
const fileBlobs = {};

const mockFiles = {
  "main.js": `
        import { helper } from 'utils';
        import { greet } from 'greeting';

        export async function run() {
            console.log('Utils module:', helper);
            helper();
            greet('World');
            console.log('Main module loaded!');
        }
    `,
  "utils.js": `
        export function helper() {
            console.log('Utility function called');
        }
    `,
  "greeting.js": `
        export function greet(name) {
            console.log('Hello, ' + name + '!');
        }
    `,
};

function createBlobURL(filename, content) {
  const blob = new Blob([content.trim()], { type: "application/javascript" });
  const blobURL = URL.createObjectURL(blob);
  fileBlobs[filename] = blobURL;
  return blobURL;
}

function sendFilesToIframe() {
  iframe.contentWindow.postMessage(
    { type: "fileSystem", files: fileBlobs },
    "*"
  );
}

function loadMockFiles() {
  Object.entries(mockFiles).forEach(([filename, content]) => {
    createBlobURL(filename, content);
  });

  sendFilesToIframe();
  iframe.addEventListener("load", sendFilesToIframe);
}

loadMockFiles();

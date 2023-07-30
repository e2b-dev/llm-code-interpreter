# Code Interpreter on steroids for ChatGPT (by e2b)

[E2B](https://e2b.dev/) plugin for ChatGPT is like **code interpreter on steroids**.

We gives your ChatGPT instance access to a full cloud environment that's sandboxed. That means:
- Access to Linux OS
- Using filesystem (create, list, and delete files and dirs)
- Run processes
- Sandboxed - you can run any code
- Access to the internet

These cloud instances are meant to be used for agents. Like a sandboxed playgrounds, where the agent can do whatever it wants.

## ❓ What can I do with this plugin?
This plugin exposes 3 simple commands (see the [OpenAPI file](https://github.com/e2b-dev/chatgpt-plugin/blob/main/openapi.yaml)):
- `RunCommand`
  - Runs any shell command
- `ReadFile`
  - Reads file on path
- `WriteFile`
  - Writes content to a file on a path


Here is a few ideas what you can do with these commands:
- Run **any** language, not just Python. Currently supported out of the box:
  - Nodejs
  - Go
  - Bash
  - Rust
  - Python3
  - PHP
  - Java
  - Perl
  - .NET

  Please open an issue if you want us to support another language
    
- Run databases
- Start servers
- Run terminal commands
- Create long running processes
- Deploy websites
- Install programs via terminal

## 💻 Installation
There are two ways:
1. Wait for OpenAI to approve our plugin in their store
2. Have developer access to ChatGPT plugins and install the plugin by following the instructions below for how to [run plugin locally](#how-to-run-plugin-locally)

### How to run plugin locally
To install the required packages for this plugin, run the following command:

```bash
npm install
```

To run the plugin, enter the following command:

```bash
npm run dev
```

Once the local server is running:

1. Navigate to https://chat.openai.com.
2. In the Model drop down, select "Plugins" (note, if you don't see it there, you don't have access yet).
3. Select "Plugin store"
4. Select "Develop your own plugin"
5. Enter in localhost:3000 since this is the URL the server is running on locally, then select "Find manifest file".

## 🤖 Usage examples
> Install youtube-dl and use it to download this video https://www.youtube.com/watch?v=jNQXAC9IVRw

> Start HTTP server on port 3000

> Clone this repo "https://github.com/e2b-dev/chatgpt-plugin", fix any typos in readme push it

## 📂 How to upload & download files
The official ChatGPT Code Interpreter supports uploading and downloading files. While the e2b code interpreter doesn't support this functionality natively (yet), you can "hack" around it just by using the `curl` command and a service such as the S3 bucket. 

### Uploading your files
1. Get S3 bucket (or any alternative)
2. Upload your files there and make them public or accessible with a signed URL
3. Tell ChatGPT to download that files using curl

### Download files
1. Tell ChaGPT to upload its files to S3 bucket using curl

## What is e2b?
[E2B](https://www.e2b.dev/) is the company behind this plugin. We're building an operating system for AI agents. A set of low-level APIs for building agents (debugging, auth, monitor, and more) together with sandboxed cloud environments for the agents where the agents can roam freely without barriers 🐎.

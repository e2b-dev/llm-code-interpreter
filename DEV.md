# Dev
## Issues
- Work on plugin manifest and OpenAPI spec descriptions
- Change deployment URL
- Add prettier
- Add eslint
- Add handling of binary files upload/read/write (right now the read/write is handling utf-8 data) - https://tsoa-community.github.io/docs/file-upload.html
- Expose more environment methods and parameters
- Expose URL for the running environment
- Fix logo hosting (not GH)
- Fix legal page url
- Add spectral for linting tsoa generated docs (https://stoplight.io/p/docs/gh/stoplightio/spectral)
- Add examples to API doc
- Add lint action
- Enable GH analysis
- Add vale
- Add issue/PR templates
- Improve README.md
- Add support for function calling OpenAI API
- Add url of the localhost server to the spec only in dev env
- Post request confirmation flow?
- Prepare for "install unverified plugin"
- Publish plugin
- Remove text body parsers? (chatGPT doesn't play well with plain text body)
- Make issues from user issues
- Can we document the response without creating return types?
- ChatGPT tries to use read file even for listing directory content
- Handle in which env are the operations executed because sometimes ChatGPT will switch to another env between operations - maybe create a single env that has all the dependencies?
- Enable diff edits to save context
- ChatGPT sometimes insists that it doesn't have capacity for editing files (on GitHub) - maybe we should rename "code interpreter" to something less obvious that it can edit downloaded repo
- ChatGPT seems to think that when using Python env it can run python with the RunCommand operation directly (is is not using `python print(...)` but `print(...)`). It may think it is in the Python REPL.

> we can change the API for the plugins whenever we want - we don't need to think about backward compatibility that much because the API is understood again everytime the plugin is used.

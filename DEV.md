# Dev

## Issues
- Work on plugin manifest and OpenAPI spec descriptions
- Deploy on normal url (GCP load balancer + cloudflare)
- Add prettier
- Finish GCP deployment setup
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
- Explain how to contribute - what commands to call to generate and which docs/strings to modify to add to spec
- Move to ubuntu
- Fix clock drift
- Fix devbookd freeze
- Manually check all envs
- Add url of the localhost server to the spec only in dev env
- Post request confirmation flow
- Remove text body parsers? (chatGPT doesn't play well with plain text body)

> we can change the API for the plugins whenever we want - we don't need to think about backward compatibility that much because the API is understood again everytime the plugin is used.

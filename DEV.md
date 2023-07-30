# Dev
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

> we can change the API for the plugins whenever we want - we don't need to think about backward compatibility that much because the API is understood again everytime the plugin is used.

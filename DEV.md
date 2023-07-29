# Dev

- Expose OpenAPI spec and plugin manifest through API
- Work on plugin manifest and OpenAPI spec de
- Deploy on normal url (GCP load balancer + cloudflare)
- Add handling of binary files (right now the read/write is handling utf-8 data) - https://tsoa-community.github.io/docs/file-upload.html
- Add prettier
- Finish readme - installation and usage info
- Finish GCP deployment setup
- Add vale
- Review tsconfig

> we can change the API for the plugins whenever we want - we don't need to think about backward compatibility that much because the API is understood again everytime the plugin is used.

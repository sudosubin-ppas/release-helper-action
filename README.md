# Release Helper Action

![Repository License](https://img.shields.io/github/license/sudosubin-ppas/release-helper-action)
![Repository Release](https://img.shields.io/github/v/release/sudosubin-ppas/release-helper-action?include_prereleases)


## Quick Start

```yml
- uses: sudosubin-ppas/release-helper-action@v0.1.0
  with:
    prepare-command: 'yarn install --frozen-lockfile'
    build-command: 'yarn run build'
    target-branch: 'release'
    create-release: 'false'
```


## How does it work

0. You need to `checkout` in your project.
1. This action will build your project, and create a commit to the `release` branch.
2. (Optional) This action will create a tag and a release. You can manually toggle your release to publish or not.


## Examples

- You can find this action's definitions from [action.yml](./action.yml).
- You can find a real usage from [.github/workflows/release.yml](./.github/workflows/release.yml).


## License

Release Helper Action is [MIT Licensed](./LICENSE).

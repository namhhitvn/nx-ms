# Myorg

## <a name="dependencies"></a> Dependencies

<a href="https://nodejs.org/en/download/"><img src="https://img.shields.io/badge/Node.JS-v16+-success?style=flat&logo=node.js" alt="Node" /></a>
<a href="https://classic.yarnpkg.com/"><img src="https://img.shields.io/badge/yarn-v1.22+-success?style=flat&logo=yarn" alt="Yarn" /></a>
<a href="https://www.docker.com/get-started"><img src="https://img.shields.io/badge/Docker-v20.10+-success?style=flat&logo=docker" alt="Docker" /></a>
<a href="https://www.docker.com/get-started"><img src="https://img.shields.io/badge/docker--compose-v2.6+-success?style=flat&logo=docker" alt="Docker compose" /></a>

## <a name="develop-setup"></a> Development setup

### <a name="develop-setup-ide"></a> IDE

We developed on [Visual Studio Code (VSCode)](https://code.visualstudio.com/). Open this repository with VSCode, we have defined some recommended extensions, source control/git control multiple repositories, debugging and IDE setting.

At first time you open the work-space, the IDE will show the confirm to install recommended extensions, then you have to accept to install all recommended extensions.

### <a name="develop-setup-config"></a> Force Change git config `core.autocrlf` to false

The project use **end of line (eol)** `\n` instead of `\r\n`, so you have to set value `false` for git config `core.autocrlf`. If not, the IDE will change all files to `\r\n` if you using **Windows OS** or `core.autocrlf` = true. (Noted: You can set config locally for each repository)

```bash
$ git config --global core.autocrlf false
```

### <a name="develop-setup"></a> Develop setup

```bash
# Install dependencies
$ yarn install
```

### <a name="start-example-todo"></a> Start example todo application

```bash
# For dev mode
$ bash ./tools/scripts/example-todo.dev.sh

# For production mode
$ bash ./tools/scripts/example-todo.sh
```

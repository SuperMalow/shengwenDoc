# uv 使用教程

首先 [uv](https://docs.astral.sh/uv/) 是一个继 python 版本管理、包管理、项目管理、虚拟环境管理于一体的工具，且其底层是由 Rust 编写的，所以性能也是非常优秀。
相比于传统的 conda，uv 的优势在于：

- uv 的性能比 conda 更快
- uv 的安装包体积更小
- uv 更方便管理环境
- uv 还支持临时安装包去运行项目

## uv 解决了什么问题？

`uv` 主要是解决了手动去管理 `python` 项目的虚拟环境、包依赖、命令行工具等问题。

### 传统的 python 项目开发

在传统的 python 项目开发中，开发流程是这样的：

1. 通过 `python -m venv .venv` 来为项目创建虚拟环境。
2. 接着在开发过程中，通过 `pip install package_name` 来安装项目中所使用的依赖。
3. 最后通过 `pip freeze > requirements.txt` 来将依赖信息写入到 `requirements.txt` 文件中。

但是，这种开发流程存在一些问题：

- 在安装依赖的过程中，会在 `requirements.txt` 中写入所有的直接依赖和间接依赖，导致很难被维护。

### 在传统的基础上针对 requirements 依赖问题进行优化

出现了 `requirements.txt` 直接依赖和间接依赖的问题后，社区推出了 `pyproject.toml` 文件，通过该文件来进行管理项目的依赖问题。

可以直接在 `pyproject.toml` 文件中写入依赖信息，然后通过 `pip install -e .` 来安装依赖，这样就会自动处理好所有的间接依赖问题。

自此，python 项目开发流程变成了：

1. 通过 `python -m venv .venv` 来为项目创建虚拟环境。
2. 接着激活虚拟环境 `source .venv\Scripts\activate`。
3. 然后在开发过程中，通过编辑 `pyproject.toml` 文件来添加依赖信息。
4. 接着通过 `pip install -e .` 来进行安装依赖。

**_但是每一次都按照上面的流程去走，略显麻烦，所以出现了 `uv`，其实 `uv` 只是针对上面的步骤进行了更进一步的封装。_**

## uv 安装

uv 的安装非常简单，下面的命令是通过 `pip` 来进行安装的：

```shell
pip install uv
```

## 使用 uv 创建项目

在正常的 python 项目当中，通常包含 `.gitignore` , `readme.md`, `requirements.txt`, 以及项目源代码。

那么通过 uv 来创建项目，只需要在命令行中输入以下命令即可：

```shell
uv init project_name
```

uv 会自动创建一个项目目录，目录结构如下：

```shell
project_name
├── .git
├── .gitignore
├── .python-version
├── main.py
├── pyproject.toml
└── README.md
```

- `.python-version`：项目的 python 版本，也是 uv 运行 python 指定的版本。
- `pyproject.toml`：项目的使用说明书，包含项目的名称、版本、描述、依赖包等信息。

主要是这两个文件，这两个文件是 uv 管理项目虚拟环境的关键。

## 使用 uv 管理环境

### 通过 uv 管理 python 版本

uv 跟 conda 一样，可以进行 python 版本的管理。

- 安装特定的 python 版本：`uv python install 3.12 3.13` , 这行命令会安装 python 3.12 和 3.13 版本。
- 切换 python 版本：`uv python pin 3.12` , 这行命令会切换到 python 3.12 版本。
- 查看安装的 python 版本：`uv python list --only-installed` , 这行命令会列出所有安装的 python 版本。
- 卸载 python 版本：`uv python uninstall 3.12` , 这行命令会卸载 python 3.12 版本。

### 通过 uv 添加项目依赖

uv 除了可以管理 python 版本之外，还可以管理项目依赖。uv 还会自动将项目依赖信息写入到 `pyproject.toml` 文件中。

```shell
uv add package_name
```

通过以上的命令，uv 会自动将项目依赖进行下载并将以来信息写入到 `pyproject.toml` 文件中。

### 通过 uv 将项目的依赖进行安装

在 python 中对于项目的依赖，常常对前端同学很是羡慕，毕竟前端同学可以直接 `npm install` 就可以安装依赖。那么在 uv 当中，也有类似的命令：

```shell
uv sync
```

通过上述命令，uv 会自动将项目中 `pyproject.toml` 文件中的依赖进行安装。

## 使用 uv 管理命令行工具

python 中拥有一些命令行工具，类似 pytest 用来进行单元测试，ruff 用来检查格式等工具。那么这种在命令行中运行的工具，uv 提供了统一的管理。

uv 通过 `uv tool install package_name` 来安装命令行工具(安装到全局环境当中)。这样就可以直接进行使用对应的命令行工具，而无需在任何环境当中。

同样的，可以通过 `uv tool uninstall package_name` 来卸载命令行工具(从全局环境中卸载)。

### 通过 uv 临时的虚拟环境来运行工具

在 uv 当中，可以通过 `uvx package_name` 来运行对应的命令行工具。这种方式，uv 会自动创建一个临时的虚拟环境，然后安装对应的工具，最后运行对应的工具。但是该工具并不会安装到本地当中。

### 通过 uv 临时虚拟环境运行 python 文件

假设一个 python 文件 `main.py` 中需要依赖其他第三方包，但是在本地当中并没有该包，那么正常来说通过 `python main.py` 运行项目会报错无法正常运行。

但是 uv 中提供了一个非常方便的操作：

1. 首先通过 `uv init --script main.py` 来针对 `main.py` 进行 uv 的初始化，此时 uv 会将一些依赖信息写入该文件的最开头。
2. 在 uv 生成的信息当中填写对应需要的依赖信息。
3. 通过 `uv run main.py` 即可成功运行 `main.py` 文件。

## \* 如何使用 uv 开发项目？

接下来将演示如何使用 `uv` 来开发一个主流的规范的 `python` 项目。

### 1. 创建项目

创建项目的命令如下：

```shell
uv init halo
```

**_TIPS：_** `uv` 自动生成的 `main.py` 可以直接删除。

如果使用的是 `vscode` 进行开发~~(非 vscode 不用看，因为会自动识别到虚拟环境)~~，可以通过设置右下角 `python` 虚拟环境为当前目录下的 `.venv` 虚拟环境。这样在 vscode 中就会识别到你虚拟环境中依赖的包，方便开发。

### 2. 添加项目依赖

```shell
uv add flask
```

### 3. 整理项目结构/开发项目

通常会在项目的根目录下的 `src` 目录下新建一个跟项目名称相同的文件夹(**例：halo/src/halo**)，然后在该文件夹下进行开发。

标准的 `python` 项目结构如下：

```shell
halo
├── .git
├── .gitignore
├── .python-version
├── docs
│   └── api-intro.md
├── tests
│   └── test_halo.py
├── src
│   └── halo
│       └── main.py
├── pyproject.toml
└── README.md
```

### \*4. 如何使用别人的项目

通常在 `GitHub` 拉取成功别人的项目之后。我们可以通过 `uv sync` 命令，该命令可以自动将 `pyproject.toml` 文件中的依赖进行安装。
接着，通过 `uv run main.py` 来运行项目即可，非常简单！

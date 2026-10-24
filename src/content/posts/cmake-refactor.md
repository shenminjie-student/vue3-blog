---
title: 重写 CMake 构建脚本：从 300 行到 90 行
date: 2025-01-05
tags: [技术, Qt, CMake]
summary: 一个越写越长的 CMakeLists.txt 是怎么被拆成可复用模块的，以及拆完之后构建快了多少。
---

## 起点：一个没人敢改的文件

接手项目时，根目录的 `CMakeLists.txt` 有 312 行，被复制到了四个子项目里。任何人都能看出来它有问题，但没人愿意动——毕竟「能编过」。

问题清单：

- 编译选项在五个地方重复定义；
- 有新同事加了一个源文件，忘了加进构建，直到运行时链接失败；
- Debug 构建误用了 Release 的第三方库；
- CI 上编译要 12 分钟。

## 目标

不追求「现代 CMake」的纯度，只求三件事：

1. **单一事实来源**：编译选项、依赖版本只写一次；
2. **目标清晰**：每个子项目只声明自己需要什么；
3. **构建可缓存**：能上 `ccache` 与 `sccache`。

## 第一步：抽出公共模块

新建 `cmake/ProjectDefaults.cmake`，提供几个函数：

```cmake
function(project_defaults target)
  target_compile_features(${target} PRIVATE cxx_std_17)
  target_compile_options(${target} PRIVATE
    $<$<CXX_COMPILER_ID:MSVC>:/W4 /permissive->
    $<$<NOT:$<CXX_COMPILER_ID:MSVC>>:-Wall -Wextra -Wpedantic>
  )
  set_target_properties(${target} PROPERTIES
    CXX_STANDARD 17
    CXX_STANDARD_REQUIRED ON
    AUTOMOC ON
    AUTOUIC ON
    AUTORCC ON
  )
endfunction()
```

子项目里只需要：

```cmake
add_library(core STATIC ${CORE_SOURCES})
project_defaults(core)
target_link_libraries(core PUBLIC Qt6::Core Qt6::Widgets)
```

## 第二步：用 target_* 代替全局变量

旧的写法：

```cmake
include_directories(${CMAKE_SOURCE_DIR}/include)
link_directories(${THIRD_PARTY}/lib)
add_definitions(-DENABLE_LOG)
```

新写法：

```cmake
target_include_directories(core PUBLIC include)
target_link_directories(core PRIVATE ${THIRD_PARTY}/lib)
target_compile_definitions(core PRIVATE ENABLE_LOG)
```

好处是依赖关系变成可追踪的：谁用了什么，从 `target_link_libraries` 一眼能看出来。

## 第三步：把第三方库变成 imported target

```cmake
add_library(thirdparty::fmt SHARED IMPORTED)
set_target_properties(thirdparty::fmt PROPERTIES
  IMPORTED_LOCATION "${THIRD_PARTY}/lib/fmt.dll"
  IMPORTED_IMPLIB   "${THIRD_PARTY}/lib/fmt.lib"
  INTERFACE_INCLUDE_DIRECTORIES "${THIRD_PARTY}/include"
)
```

这样 `fmt` 的头文件路径和库文件不会散落到各个子项目里。

## 第四步：配置与构建分离

```bash
cmake -S . -B build -G Ninja \
  -DCMAKE_BUILD_TYPE=Release \
  -DCMAKE_CXX_COMPILER_LAUNCHER=ccache

cmake --build build --parallel
```

`-S/-B` 的写法避免在源码目录里生成一堆中间文件，也方便同时保留 Debug 和 Release 两个构建目录。

## 结果

| 指标 | 改造前 | 改造后 |
| --- | --- | --- |
| 根 CMakeLists 行数 | 312 | 94 |
| 重复的编译选项 | 5 处 | 1 处 |
| CI 构建耗时 | 12 min | 7 min |
| 新增文件出错率 | 偶尔 | 0（用 `file(GLOB_RECURSE CONFIGURE_DEPENDS)`） |

最后一条要提醒：`GLOB` 在社区里常被批评，但加上 `CONFIGURE_DEPENDS` 之后，主流生成器都会在文件变化时重新配置。对内部项目来说，这点便利比理论上的洁癖更值钱。

## 一点点经验

- 重构构建脚本时，**先让新旧两套并存**，确认能编出同样的产物再删旧的；
- 每拆一步都跑一遍 CI，不要一口气改完；
- `cmake --graphviz` 可以导出依赖图，排查循环依赖很有用。

构建脚本也是代码，它也值得被认真对待。

# debug

Name: <i>@fb-sys/debug</i>
<br>
Version: <i>1.0.0</i>

- [Install](#install)
- [Usage](#usage)

## Install

```bash
npm install @fb-sys/debug
```

## Usage

```javascript
import { makeDebug } from '@fb-sys/debug';

const debug = makeDebug('my-app', { color: true });

debug('Hello world!');
```

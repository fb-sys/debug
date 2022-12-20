# debug

Name: <i>@victor-systems/debug</i>
<br>
Version: <i>1.0.0</i>

- [Install](#install)
- [Usage](#usage)

## Install

```bash
npm install @victor-systems/debug
```

## Usage

```javascript
import { makeDebug } from '@victor-systems/debug';

const debug = makeDebug('my-app', { color: true });

debug('Hello world!');
```

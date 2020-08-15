import toastr from 'toastr';
import 'toastr/build/toastr.css';

function ApiHandler() {
  function erroHandler() {
    return undefined;
  }

  async function getItem(ids, col, query) {
    if (!ids) {
      throw new Error({
        message: 'No ids supplied',
      });
    }

    let url = '';
    if (!Array.isArray(ids)) {
      url = `/api/${col}/${ids}`;
    } else {
      url = `/api/${col}`;
    }

    const rowData_ = await Promise.resolve($.get(url, query || {}));
    if (!Array.isArray(rowData_)) return [rowData_];
    else return rowData_;
  }

  async function createItem(obj, col) {
    const url = `/api/${col}`;
    const resObject = await Promise.resolve($.post(url, obj)).catch(erroHandler);
    return resObject;
  }

  async function patchItem(obj, col) {
    const type = 'PUT';
    const url = `/api/${col}/${obj.id}`;
    const resObject = await Promise.resolve($.ajax({
      url,
      type,
      data: obj,
    })).catch(erroHandler);
    return resObject;
  }

  async function deleteItem(obj, col) {
    const url = `/api/${col}/${obj.id}`;
    const type = 'DELETE';
    const resObject = await Promise.resolve($.ajax({
      url,
      type,
    })).catch(erroHandler);
    return resObject;
  }

  // TODO: to implement
  async function getLength(obj, col, query) {
    const url = `/api/${col}/count`;

    const rowData_ = await Promise.resolve($.get(url, query || {})).catch(erroHandler);
    return rowData_;
  }

  return {
    getItem,
    createItem,
    patchItem,
    deleteItem,
    getLength,
  };
}

function VisualEffects() {
  function withStyles(css_, namespace = '', componentName = '&') {
    const name = namespace;
    let style = name && document.getElementById(name);
    const css = css_.

    // Prettier output.
    replace(/}\s*/ig, '\n}\n').

    // Regular rules are namespaced.
    replace(
      /(^|{|}|;|,)\s*([&a-z0-9\-_\.:#\(\),>*\s]+)\s*(\{)/ig, (matched) =>
      matched.replace(new RegExp(componentName, 'g'), namespace || `[ng-controller="${name}"]`)
    );

    if (style) {
      if ('textContent' in style) {
        style.textContent = css;
      } else {
        style.styleSheet.cssText = css;
      }
    } else {
      style = document.createElement('style');
      style.setAttribute('id', name);
      style.setAttribute('type', 'text/css');

      if ('textContent' in style) {
        style.textContent = css;
      } else {
        style.styleSheet.cssText = css;
      }

      document.getElementsByTagName('head')[0].appendChild(style);
    }

    // return Component;
  }

  return {
    toast: toastr,
    withStyles,
  };
}

function StateManager($state) {
  function stateChange(from) {
    return (obj, col) => {
      const query = {};
      switch (true) {
        case from === 'clientRequest':
          query.id = obj.device;
          break;
        case from === 'userAction' && col === 'device':
        case from === 'userAction' && col === 'clientRequest':
          query.id = obj.device;
          break;
        default:
          query.id = obj.id;
      }

      switch (col) {
        case 'device':
          $state.go('device', query);
          break;
        case 'userAction':
          $state.go('userAction', query);
          break;
        case 'clientRequest':
          $state.go('clientRequest', query);
          break;
        case 'transferLog':
          $state.go('transferLog', query);
          break;
        default:
          alert(`No such collection: ${col}`);
      }
    };
  }

  return {
    stateChange,
  };
}

// this is a convenience function to allow to prefix template strings so
// that editors can interpret the grammar within as html
// if you want to name it the easy way: a flag for right syntax grammar
function html(templateObject, ...substs) {
  // Use raw template strings: we don’t want
  // backslashes (\n etc.) to be interpreted
  const raw = templateObject.raw;

  let result = '';

  substs.forEach((subst, i) => {
    // Retrieve the template string preceding
    // the current substitution
    let lit = raw[i];

    // In the example, map() returns an Array:
    // If substitution is an Array (and not a string),
    // we turn it into a string
    if (Array.isArray(subst)) {
      subst = subst.join('');
    }

    // If the substitution is preceded by a dollar sign,
    // we escape special characters in it
    if (lit.endsWith('$')) {
      // subst = htmlEscape(subst);
      lit = lit.slice(0, -1);
    }

    result += lit;
    result += subst;
  });

  // Take care of last template string
  // (Never fails, because an empty tagged template
  // produces one template string, an empty string)
  result += raw[raw.length - 1]; // (A)

  return result;
}

/* eslint-disable */
function ExcelWriter() {
  function datenum(v, date1904) {
    if (date1904) v += 1462;
    var epoch = Date.parse(v);
    var res = (epoch - new Date(Date.UTC(1899, 11, 30))) / (24 * 60 * 60 * 1000);
    return res;
  }

  function sheet_from_array_of_arrays(data, opts) {
    var ws = {};
    var range = {
      s: {
        c: 10000000,
        r: 10000000
      },
      e: {
        c: 0,
        r: 0
      }
    };
    for (var R = 0; R != data.length; ++R) {
      for (var C = 0; C != data[R].length; ++C) {
        if (range.s.r > R) range.s.r = R;
        if (range.s.c > C) range.s.c = C;
        if (range.e.r < R) range.e.r = R;
        if (range.e.c < C) range.e.c = C;
        var cell = {
          v: data[R][C]
        };
        if (cell.v == null) continue;
        var cell_ref = XLSX.utils.encode_cell({
          c: C,
          r: R
        });

        if (typeof cell.v === 'number') cell.t = 'n';
        else if (typeof cell.v === 'boolean') cell.t = 'b';
        else if (cell.v instanceof Date) {

          switch (true) {
            // year is 1899 - only show time
            case cell.v.getYear() === -1:
              cell.z = XLSX.SSF._table[20];
              break;

              // time 0,0,0,0 - show only date
            case cell.v.getHours() === 1 && cell.v.getMinutes() === 0 && cell.v.getMilliseconds() === 0:
              cell.z = XLSX.SSF._table[14];
              break;
            default:
              cell.z = XLSX.SSF._table[22];
          }
          cell.t = 'n';

          cell.v = datenum(cell.v);
        } else cell.t = 's';

        ws[cell_ref] = cell;
      }
    }
    if (range.s.c < 10000000) ws['!ref'] = XLSX.utils.encode_range(range);
    return ws;
  }



  function s2ab(s) {
    var buf = new ArrayBuffer(s.length);
    var view = new Uint8Array(buf);
    for (var i = 0; i != s.length; ++i) view[i] = s.charCodeAt(i) & 0xFF;
    return buf;
  }

  function exportData(data, sheetName, docName) {
    /* original data */
    // var data = [
    //   [1, 2, 3],
    //   [true, false, null, "sheetjs"],
    //   ["foo", "bar", new Date("2014-02-19T14:30Z"), "0.3"],
    //   ["baz", null, "qux"]
    // ]
    var ws_name = sheetName;

    function Workbook() {
      if (!(this instanceof Workbook)) return new Workbook();
      this.SheetNames = [];
      this.Sheets = {};
    }

    var wb = new Workbook(),
      ws = sheet_from_array_of_arrays(data);

    /* add worksheet to workbook */
    wb.SheetNames.push(ws_name);
    wb.Sheets[ws_name] = ws;
    var wbout = XLSX.write(wb, {
      bookType: 'xlsx',
      bookSST: true,
      type: 'binary',
    });

    saveAs(new Blob([s2ab(wbout)], {
      type: 'application/octet-stream'
    }), docName + '.xlsx');
  }

  return {
    load: exportData,
  }
}
/* eslint-enable */


// append to global scope so its available without everywhere
window.html = html;
window.css = html;

export {
  ApiHandler,
  VisualEffects,
  html,
  StateManager,
  ExcelWriter,
};

"use strict";

const t = {
  RBnode: function (tree) {
    this.tree = tree;
    this.right = this.tree.sentinel;
    this.left = this.tree.sentinel;
    this.parent = null;
    this.color = !1;
    this.key = null;
  },
  RedBlackSet: function (compare) {
    this.size = 0;
    this.sentinel = new t.RBnode(this);
    this.sentinel.color = !1;
    this.root = this.sentinel;
    this.root.parent = this.sentinel;
    this.compare = compare || this.default_compare;
  },
  RedBlackSet.prototype.default_compare: function (t, e) {
    return t < e ? -1 : e < t ? 1 : 0;
  },
  RedBlackSet.prototype.clone: function () {
    const e = new t.RedBlackSet(this.compare);
    return e.insertAll(this), e;
  },
  RedBlackSet.prototype.clear: function () {
    this.size = 0;
    this.sentinel = new t.RBnode(this);
    this.sentinel.color = !1;
    this.root = this.sentinel;
    this.root.parent = this.sentinel;
  },
  RedBlackSet.prototype.leftRotate: function (t) {
    const e = t.right;
    t.right = e.left;
    e.left != this.sentinel && (e.left.parent = t);
    e.parent = t.parent;
    t.parent == this.sentinel
      ? this.root = e
      : t == t.parent.left
      ? t.parent.left = e
      : t.parent.right = e;
    e.left = t;
    t.parent = e;
  },
  RedBlackSet.prototype.rightRotate: function (t) {
    const e = t.left;
    t.left = e.right;
    e.right != this.sentinel && (e.right.parent = t);
    e.parent = t.parent;
    t.parent == this.sentinel
      ? this.root = e
      : t == t.parent.right
      ? t.parent.right = e
      : t.parent.left = e;
    e.right = t;
    t.parent = e;
  },
  RedBlackSet.prototype.insert: function (r) {
    if (this.contains(r)) {
      this.get_(r).key = r;
    } else {
      const i = new t.RBnode(this);
      i.key = r;
      let n = this.sentinel;
      let o = this.root;
      while (o != this.sentinel) {
        n = o;
        o = this.compare(i.key, o.key) < 0 ? o.left : o.right;
      }
      i.parent = n;
      n == this.sentinel
        ? this.root = i
        : this.compare(i.key, n.key) < 0
        ? n.left = i
        : n.right = i;
      i.left = this.sentinel;
      i.right = this.sentinel;
      i.color = !0;
      this.insertFixup(i);
      this.size++;
    }
  },
  RedBlackSet.prototype.insertFixup: function (t) {
    for (; t != this.sentinel && t != this.root && t.parent.color == !0;) {
      if (t.parent == t.parent.parent.left) {
        const i = t.parent.parent.right;
        if (i.color == !1) {
          t.parent.color = !1;
          i.color = !1;
          t.parent.parent.color = !0;
          t = t.parent.parent;
        } else {
          if (t == t.parent.right) {
            t = t.parent;
            this.leftRotate(t);
          }
          t.parent.color = !1;
          t.parent.parent.color = !0;
          this.rightRotate(t.parent.parent);
        }
      } else {
        const i = t.parent.parent.left;
        if (i.color == !1) {
          t.parent.color = !1;
          i.color = !1;
          t.parent.parent.color = !0;
          t = t.parent.parent;
        } else {
          if (t == t.parent.left) {
            t = t.parent;
            this.rightRotate(t);
          }
          t.parent.color = !1;
          t.parent.parent.color = !0;
          this.leftRotate(t.parent.parent);
        }
      }
    }
    this.root.color = !1;
  },
  RedBlackSet.prototype.delete_: function (t) {
    let e, i;
    const n = (e = t.left == this.sentinel || t.right == this.sentinel ? t : this.successor_(t));
    i = e.left != this.sentinel ? e.left : e.right;
    i.parent = e.parent;
    e.parent == this.sentinel
      ? this.root = i
      : e == e.parent.left
      ? e.parent.left = i
      : e.parent.right = i;
    e != t && (t.key = e.key);
    e.color == !1 && this.deleteFixup(i);
    this.size--;
  },
  RedBlackSet.prototype.deleteFixup: function (t) {
    for (; t != this.root && t.color == !1;) {
      if (t == t.parent.left) {
        const i = t.parent.right;
        if (i.color == !0) {
          i.color = !1;
          t.parent.color = !0;
          this.leftRotate(t.parent);
          i = t.parent.right;
        }
        if (i.left.color == !1 && i.right.color == !1) {
          i.color = !0;
          t = t.parent;
        } else {
          if (i.right.color == !1) {
            i.left.color = !1;
            i.color = !0;
            this.rightRotate(i);
            i = t.parent.right;
          }
          i.color = t.parent.color;
          t.parent.color = !1;
          i.right.color = !1;
          this.leftRotate(t.parent);
          t = this.root;
        }
      } else {
        const i = t.parent.left;
        if (i.color == !0) {
          i.color = !1;
          t.parent.color = !0;
          this.rightRotate(t.parent);
          i = t.parent.left;
        }
        if (i.left.color == !1 && i.right.color == !1) {
          i.color = !0;
          t = t.parent;
        } else {
          if (i.left.color == !1) {
            i.right.color = !1;
            i.color = !0;
            this.leftRotate(i);
            i = t.parent.left;
          }
          i.color = t.parent.color;
          t.parent.color = !1;
          i.left.color = !1;
          this.rightRotate(t.parent);
          t = this.root;
        }
      }
    }
    t.color = !1;
  },
  RedBlackSet.prototype.remove: function (t) {
    const e = this.get_(t);
    if (e != this.sentinel) {
      const r = e.key;
      this.delete_(e);
      return r;
    }
    return null;
  },
  RedBlackSet.prototype.removeSwapped: function (t, e) {
    this.remove(e);
  },
  RedBlackSet.prototype.min: function (t) {
    for (; t.left != this.sentinel;) t = t.left;
    return t;
  },
  RedBlackSet.prototype.max: function (t) {
    for (; t.right != this.sentinel;) t = t.right;
    return t;
  },
  RedBlackSet.prototype.successor_: function (t) {
    if (t.right != this.sentinel) return this.min(t.right);
    for (let e = t.parent; e != this.sentinel && t == e.right;) t = e, e = e.parent;
    return e;
  },
  RedBlackSet.prototype.predeccessor_: function (t) {
    if (t.left != this.sentinel) return this.max(t.left);
    for (let e = t.parent; e != this.sentinel && t == e.left;) t = e, e = e.parent;
    return e;
  },
  RedBlackSet.prototype.successor: function (t) {
    if (this.size > 0) {
      const e = this.get_(t);
      if (e == this.sentinel) return null;
      if (e.right != this.sentinel) return this.min(e.right).key;
      for (let r = e.parent; r != this.sentinel && e == r.right;) e = r, r = r.parent;
      return r != this.sentinel ? r.key : null;
    }
    return null;
  },
  RedBlackSet.prototype.predecessor: function (t) {
    if (this.size > 0) {
      const e = this.get_(t);
      if (e == this.sentinel) return null;
      if (e.left != this.sentinel) return this.max(e.left).key;
      for (let r = e.parent; r != this.sentinel && e == r.left;) e = r, r = r.parent;
      return r != this.sentinel ? r.key : null;
    }
    return null;
  },
  RedBlackSet.prototype.getMin: function () {
    return this.min(this.root).key;
  },
  RedBlackSet.prototype.getMax: function () {
    return this.max(this.root).key;
  },
  RedBlackSet.prototype.get_: function (t) {
    let e = this.root;
    while (e != this.sentinel && this.compare(e.key, t) != 0) {
      e = this.compare(t, e.key) < 0 ? e.left : e.right;
    }
    return e;
  },
  RedBlackSet.prototype.contains: function (t) {
    return this.get_(t).key != undefined;
  },
  RedBlackSet.prototype.getValues: function () {
    const t = [];
    this.forEach((e) => {
      t.push(e);
    });
    return t;
  },
  RedBlackSet.prototype.insertAll: function (e) {
    if (Array.isArray(e)) {
      for (let r = 0; r < e.length; r++) this.insert(e[r]);
    } else if (typeof e.forEach == "function") {
      e.forEach(this.insert);
    } else if (typeof e.getValues == "function") {
      const r = e.getValues();
      for (let i = 0; i < r.length; i++) this.insert(r[i]);
    } else if (typeof e == "object") {
      for (const r in e) this.insert(e[r]);
    }
  },
  RedBlackSet.prototype.removeAll: function (e) {
    if (Array.isArray(e)) {
      for (let r = 0; r < e.length; r++) this.remove(e[r]);
    } else if (typeof e.forEach == "function") {
      e.forEach(this.removeSwapped);
    } else if (typeof e.getValues == "function") {
      const r = e.getValues();
      for (let i = 0; i < r.length; i++) this.remove(r[i]);
    } else if (typeof e == "object") {
      for (const r in e) this.remove(e[r]);
    }
  },
  RedBlackSet.prototype.containsAll: function (e) {
    if (Array.isArray(e)) {
      for (let r = 0; r < e.length; r++) if (!this.contains(e[r])) return !1;
      return !0;
    }
    if (typeof e.forEach == "function") {
      return e.every(this.contains, this);
    }
    if (typeof e.getValues == "function") {
      const r = e.getValues();
      for (let i = 0; i < r.length; i++) if (!this.contains(r[i])) return !1;
      return !0;
    }
    if (typeof e == "object") {
      for (const r in e) if (!this.contains(e[r])) return !1;
      return !0;
    }
  },
  RedBlackSet.prototype.range: function (t, e) {
    const r = [];
    this.traverseFromTo((e) => {
      r.push(e);
    }, t, e);
    return r;
  },
  RedBlackSet.prototype.traverse: function (t, e) {
    if (!this.isEmpty()) {
      const r = this.min(this.root);
      let n = r;
      while (n != this.sentinel) {
        if (t.call(e, n.key, this)) return;
        n = this.successor_(n);
      }
    }
  },
  RedBlackSet.prototype.traverseFrom: function (t, e, r) {
    if (!this.isEmpty()) {
      const i = this.get_(e);
      let n = i;
      while (n != this.sentinel) {
        if (t.call(r, n.key, this)) return;
        n = this.successor_(n);
      }
    }
  },
  RedBlackSet.prototype.traverseTo: function (t, e, r) {
    if (!this.isEmpty()) {
      const i = this.min(this.root);
      let n = i;
      while (n != this.sentinel && n != this.get_(e)) {
        if (t.call(r, n.key, this)) return;
        n = this.successor_(n);
      }
    }
  },
  RedBlackSet.prototype.traverseFromTo: function (t, e, r, i) {
    if (!this.isEmpty()) {
      const n = this.get_(e);
      let o = n;
      while (o != this.sentinel && o != this.get_(r)) {
        if (t.call(i, o.key, this)) return;
        o = this.successor_(o);
      }
    }
  },
  RedBlackSet.prototype.traverseBackwards: function (t, e) {
    if (!this.isEmpty()) {
      const r = this.max(this.root);
      let n = r;
      while (n != this.sentinel) {
        if (t.call(e, n.key, this)) return;
        n = this.predeccessor_(n);
      }
    }
  },
  RedBlackSet.prototype.forEach: function (t, e) {
    if (!this.isEmpty()) {
      const r = this.min(this.root);
      let n = r;
      while (n != this.sentinel) {
        t.call

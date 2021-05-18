
(function(l, r) { if (l.getElementById('livereloadscript')) return; r = l.createElement('script'); r.async = 1; r.src = '//' + (window.location.host || 'localhost').split(':')[0] + ':35729/livereload.js?snipver=1'; r.id = 'livereloadscript'; l.getElementsByTagName('head')[0].appendChild(r) })(window.document);
var app = (function () {
    'use strict';

    function noop() { }
    function assign(tar, src) {
        // @ts-ignore
        for (const k in src)
            tar[k] = src[k];
        return tar;
    }
    function add_location(element, file, line, column, char) {
        element.__svelte_meta = {
            loc: { file, line, column, char }
        };
    }
    function run(fn) {
        return fn();
    }
    function blank_object() {
        return Object.create(null);
    }
    function run_all(fns) {
        fns.forEach(run);
    }
    function is_function(thing) {
        return typeof thing === 'function';
    }
    function safe_not_equal(a, b) {
        return a != a ? b == b : a !== b || ((a && typeof a === 'object') || typeof a === 'function');
    }
    function is_empty(obj) {
        return Object.keys(obj).length === 0;
    }
    function validate_store(store, name) {
        if (store != null && typeof store.subscribe !== 'function') {
            throw new Error(`'${name}' is not a store with a 'subscribe' method`);
        }
    }
    function subscribe(store, ...callbacks) {
        if (store == null) {
            return noop;
        }
        const unsub = store.subscribe(...callbacks);
        return unsub.unsubscribe ? () => unsub.unsubscribe() : unsub;
    }
    function get_store_value(store) {
        let value;
        subscribe(store, _ => value = _)();
        return value;
    }
    function component_subscribe(component, store, callback) {
        component.$$.on_destroy.push(subscribe(store, callback));
    }
    function create_slot(definition, ctx, $$scope, fn) {
        if (definition) {
            const slot_ctx = get_slot_context(definition, ctx, $$scope, fn);
            return definition[0](slot_ctx);
        }
    }
    function get_slot_context(definition, ctx, $$scope, fn) {
        return definition[1] && fn
            ? assign($$scope.ctx.slice(), definition[1](fn(ctx)))
            : $$scope.ctx;
    }
    function get_slot_changes(definition, $$scope, dirty, fn) {
        if (definition[2] && fn) {
            const lets = definition[2](fn(dirty));
            if ($$scope.dirty === undefined) {
                return lets;
            }
            if (typeof lets === 'object') {
                const merged = [];
                const len = Math.max($$scope.dirty.length, lets.length);
                for (let i = 0; i < len; i += 1) {
                    merged[i] = $$scope.dirty[i] | lets[i];
                }
                return merged;
            }
            return $$scope.dirty | lets;
        }
        return $$scope.dirty;
    }
    function update_slot(slot, slot_definition, ctx, $$scope, dirty, get_slot_changes_fn, get_slot_context_fn) {
        const slot_changes = get_slot_changes(slot_definition, $$scope, dirty, get_slot_changes_fn);
        if (slot_changes) {
            const slot_context = get_slot_context(slot_definition, ctx, $$scope, get_slot_context_fn);
            slot.p(slot_context, slot_changes);
        }
    }
    function exclude_internal_props(props) {
        const result = {};
        for (const k in props)
            if (k[0] !== '$')
                result[k] = props[k];
        return result;
    }
    function compute_rest_props(props, keys) {
        const rest = {};
        keys = new Set(keys);
        for (const k in props)
            if (!keys.has(k) && k[0] !== '$')
                rest[k] = props[k];
        return rest;
    }
    function set_store_value(store, ret, value = ret) {
        store.set(value);
        return ret;
    }

    function append(target, node) {
        target.appendChild(node);
    }
    function insert(target, node, anchor) {
        target.insertBefore(node, anchor || null);
    }
    function detach(node) {
        node.parentNode.removeChild(node);
    }
    function destroy_each(iterations, detaching) {
        for (let i = 0; i < iterations.length; i += 1) {
            if (iterations[i])
                iterations[i].d(detaching);
        }
    }
    function element(name) {
        return document.createElement(name);
    }
    function svg_element(name) {
        return document.createElementNS('http://www.w3.org/2000/svg', name);
    }
    function text(data) {
        return document.createTextNode(data);
    }
    function space() {
        return text(' ');
    }
    function empty() {
        return text('');
    }
    function listen(node, event, handler, options) {
        node.addEventListener(event, handler, options);
        return () => node.removeEventListener(event, handler, options);
    }
    function stop_propagation(fn) {
        return function (event) {
            event.stopPropagation();
            // @ts-ignore
            return fn.call(this, event);
        };
    }
    function self(fn) {
        return function (event) {
            // @ts-ignore
            if (event.target === this)
                fn.call(this, event);
        };
    }
    function attr(node, attribute, value) {
        if (value == null)
            node.removeAttribute(attribute);
        else if (node.getAttribute(attribute) !== value)
            node.setAttribute(attribute, value);
    }
    function set_attributes(node, attributes) {
        // @ts-ignore
        const descriptors = Object.getOwnPropertyDescriptors(node.__proto__);
        for (const key in attributes) {
            if (attributes[key] == null) {
                node.removeAttribute(key);
            }
            else if (key === 'style') {
                node.style.cssText = attributes[key];
            }
            else if (key === '__value') {
                node.value = node[key] = attributes[key];
            }
            else if (descriptors[key] && descriptors[key].set) {
                node[key] = attributes[key];
            }
            else {
                attr(node, key, attributes[key]);
            }
        }
    }
    function children(element) {
        return Array.from(element.childNodes);
    }
    function set_style(node, key, value, important) {
        node.style.setProperty(key, value, important ? 'important' : '');
    }
    function toggle_class(element, name, toggle) {
        element.classList[toggle ? 'add' : 'remove'](name);
    }
    function custom_event(type, detail) {
        const e = document.createEvent('CustomEvent');
        e.initCustomEvent(type, false, false, detail);
        return e;
    }

    let current_component;
    function set_current_component(component) {
        current_component = component;
    }
    function get_current_component() {
        if (!current_component)
            throw new Error('Function called outside component initialization');
        return current_component;
    }
    function onMount(fn) {
        get_current_component().$$.on_mount.push(fn);
    }
    function onDestroy(fn) {
        get_current_component().$$.on_destroy.push(fn);
    }

    const dirty_components = [];
    const binding_callbacks = [];
    const render_callbacks = [];
    const flush_callbacks = [];
    const resolved_promise = Promise.resolve();
    let update_scheduled = false;
    function schedule_update() {
        if (!update_scheduled) {
            update_scheduled = true;
            resolved_promise.then(flush);
        }
    }
    function tick() {
        schedule_update();
        return resolved_promise;
    }
    function add_render_callback(fn) {
        render_callbacks.push(fn);
    }
    let flushing = false;
    const seen_callbacks = new Set();
    function flush() {
        if (flushing)
            return;
        flushing = true;
        do {
            // first, call beforeUpdate functions
            // and update components
            for (let i = 0; i < dirty_components.length; i += 1) {
                const component = dirty_components[i];
                set_current_component(component);
                update(component.$$);
            }
            set_current_component(null);
            dirty_components.length = 0;
            while (binding_callbacks.length)
                binding_callbacks.pop()();
            // then, once components are updated, call
            // afterUpdate functions. This may cause
            // subsequent updates...
            for (let i = 0; i < render_callbacks.length; i += 1) {
                const callback = render_callbacks[i];
                if (!seen_callbacks.has(callback)) {
                    // ...so guard against infinite loops
                    seen_callbacks.add(callback);
                    callback();
                }
            }
            render_callbacks.length = 0;
        } while (dirty_components.length);
        while (flush_callbacks.length) {
            flush_callbacks.pop()();
        }
        update_scheduled = false;
        flushing = false;
        seen_callbacks.clear();
    }
    function update($$) {
        if ($$.fragment !== null) {
            $$.update();
            run_all($$.before_update);
            const dirty = $$.dirty;
            $$.dirty = [-1];
            $$.fragment && $$.fragment.p($$.ctx, dirty);
            $$.after_update.forEach(add_render_callback);
        }
    }
    const outroing = new Set();
    let outros;
    function group_outros() {
        outros = {
            r: 0,
            c: [],
            p: outros // parent group
        };
    }
    function check_outros() {
        if (!outros.r) {
            run_all(outros.c);
        }
        outros = outros.p;
    }
    function transition_in(block, local) {
        if (block && block.i) {
            outroing.delete(block);
            block.i(local);
        }
    }
    function transition_out(block, local, detach, callback) {
        if (block && block.o) {
            if (outroing.has(block))
                return;
            outroing.add(block);
            outros.c.push(() => {
                outroing.delete(block);
                if (callback) {
                    if (detach)
                        block.d(1);
                    callback();
                }
            });
            block.o(local);
        }
    }

    function get_spread_update(levels, updates) {
        const update = {};
        const to_null_out = {};
        const accounted_for = { $$scope: 1 };
        let i = levels.length;
        while (i--) {
            const o = levels[i];
            const n = updates[i];
            if (n) {
                for (const key in o) {
                    if (!(key in n))
                        to_null_out[key] = 1;
                }
                for (const key in n) {
                    if (!accounted_for[key]) {
                        update[key] = n[key];
                        accounted_for[key] = 1;
                    }
                }
                levels[i] = n;
            }
            else {
                for (const key in o) {
                    accounted_for[key] = 1;
                }
            }
        }
        for (const key in to_null_out) {
            if (!(key in update))
                update[key] = undefined;
        }
        return update;
    }
    function get_spread_object(spread_props) {
        return typeof spread_props === 'object' && spread_props !== null ? spread_props : {};
    }
    function create_component(block) {
        block && block.c();
    }
    function mount_component(component, target, anchor, customElement) {
        const { fragment, on_mount, on_destroy, after_update } = component.$$;
        fragment && fragment.m(target, anchor);
        if (!customElement) {
            // onMount happens before the initial afterUpdate
            add_render_callback(() => {
                const new_on_destroy = on_mount.map(run).filter(is_function);
                if (on_destroy) {
                    on_destroy.push(...new_on_destroy);
                }
                else {
                    // Edge case - component was destroyed immediately,
                    // most likely as a result of a binding initialising
                    run_all(new_on_destroy);
                }
                component.$$.on_mount = [];
            });
        }
        after_update.forEach(add_render_callback);
    }
    function destroy_component(component, detaching) {
        const $$ = component.$$;
        if ($$.fragment !== null) {
            run_all($$.on_destroy);
            $$.fragment && $$.fragment.d(detaching);
            // TODO null out other refs, including component.$$ (but need to
            // preserve final state?)
            $$.on_destroy = $$.fragment = null;
            $$.ctx = [];
        }
    }
    function make_dirty(component, i) {
        if (component.$$.dirty[0] === -1) {
            dirty_components.push(component);
            schedule_update();
            component.$$.dirty.fill(0);
        }
        component.$$.dirty[(i / 31) | 0] |= (1 << (i % 31));
    }
    function init(component, options, instance, create_fragment, not_equal, props, dirty = [-1]) {
        const parent_component = current_component;
        set_current_component(component);
        const $$ = component.$$ = {
            fragment: null,
            ctx: null,
            // state
            props,
            update: noop,
            not_equal,
            bound: blank_object(),
            // lifecycle
            on_mount: [],
            on_destroy: [],
            on_disconnect: [],
            before_update: [],
            after_update: [],
            context: new Map(parent_component ? parent_component.$$.context : options.context || []),
            // everything else
            callbacks: blank_object(),
            dirty,
            skip_bound: false
        };
        let ready = false;
        $$.ctx = instance
            ? instance(component, options.props || {}, (i, ret, ...rest) => {
                const value = rest.length ? rest[0] : ret;
                if ($$.ctx && not_equal($$.ctx[i], $$.ctx[i] = value)) {
                    if (!$$.skip_bound && $$.bound[i])
                        $$.bound[i](value);
                    if (ready)
                        make_dirty(component, i);
                }
                return ret;
            })
            : [];
        $$.update();
        ready = true;
        run_all($$.before_update);
        // `false` as a special case of no DOM component
        $$.fragment = create_fragment ? create_fragment($$.ctx) : false;
        if (options.target) {
            if (options.hydrate) {
                const nodes = children(options.target);
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.l(nodes);
                nodes.forEach(detach);
            }
            else {
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.c();
            }
            if (options.intro)
                transition_in(component.$$.fragment);
            mount_component(component, options.target, options.anchor, options.customElement);
            flush();
        }
        set_current_component(parent_component);
    }
    /**
     * Base class for Svelte components. Used when dev=false.
     */
    class SvelteComponent {
        $destroy() {
            destroy_component(this, 1);
            this.$destroy = noop;
        }
        $on(type, callback) {
            const callbacks = (this.$$.callbacks[type] || (this.$$.callbacks[type] = []));
            callbacks.push(callback);
            return () => {
                const index = callbacks.indexOf(callback);
                if (index !== -1)
                    callbacks.splice(index, 1);
            };
        }
        $set($$props) {
            if (this.$$set && !is_empty($$props)) {
                this.$$.skip_bound = true;
                this.$$set($$props);
                this.$$.skip_bound = false;
            }
        }
    }

    function dispatch_dev(type, detail) {
        document.dispatchEvent(custom_event(type, Object.assign({ version: '3.38.2' }, detail)));
    }
    function append_dev(target, node) {
        dispatch_dev('SvelteDOMInsert', { target, node });
        append(target, node);
    }
    function insert_dev(target, node, anchor) {
        dispatch_dev('SvelteDOMInsert', { target, node, anchor });
        insert(target, node, anchor);
    }
    function detach_dev(node) {
        dispatch_dev('SvelteDOMRemove', { node });
        detach(node);
    }
    function listen_dev(node, event, handler, options, has_prevent_default, has_stop_propagation) {
        const modifiers = options === true ? ['capture'] : options ? Array.from(Object.keys(options)) : [];
        if (has_prevent_default)
            modifiers.push('preventDefault');
        if (has_stop_propagation)
            modifiers.push('stopPropagation');
        dispatch_dev('SvelteDOMAddEventListener', { node, event, handler, modifiers });
        const dispose = listen(node, event, handler, options);
        return () => {
            dispatch_dev('SvelteDOMRemoveEventListener', { node, event, handler, modifiers });
            dispose();
        };
    }
    function attr_dev(node, attribute, value) {
        attr(node, attribute, value);
        if (value == null)
            dispatch_dev('SvelteDOMRemoveAttribute', { node, attribute });
        else
            dispatch_dev('SvelteDOMSetAttribute', { node, attribute, value });
    }
    function set_data_dev(text, data) {
        data = '' + data;
        if (text.wholeText === data)
            return;
        dispatch_dev('SvelteDOMSetData', { node: text, data });
        text.data = data;
    }
    function validate_each_argument(arg) {
        if (typeof arg !== 'string' && !(arg && typeof arg === 'object' && 'length' in arg)) {
            let msg = '{#each} only iterates over array-like objects.';
            if (typeof Symbol === 'function' && arg && Symbol.iterator in arg) {
                msg += ' You can use a spread to convert this iterable into an array.';
            }
            throw new Error(msg);
        }
    }
    function validate_slots(name, slot, keys) {
        for (const slot_key of Object.keys(slot)) {
            if (!~keys.indexOf(slot_key)) {
                console.warn(`<${name}> received an unexpected slot "${slot_key}".`);
            }
        }
    }
    /**
     * Base class for Svelte components with some minor dev-enhancements. Used when dev=true.
     */
    class SvelteComponentDev extends SvelteComponent {
        constructor(options) {
            if (!options || (!options.target && !options.$$inline)) {
                throw new Error("'target' is a required option");
            }
            super();
        }
        $destroy() {
            super.$destroy();
            this.$destroy = () => {
                console.warn('Component was already destroyed'); // eslint-disable-line no-console
            };
        }
        $capture_state() { }
        $inject_state() { }
    }

    const subscriber_queue = [];
    /**
     * Create a `Writable` store that allows both updating and reading by subscription.
     * @param {*=}value initial value
     * @param {StartStopNotifier=}start start and stop notifications for subscriptions
     */
    function writable(value, start = noop) {
        let stop;
        const subscribers = [];
        function set(new_value) {
            if (safe_not_equal(value, new_value)) {
                value = new_value;
                if (stop) { // store is ready
                    const run_queue = !subscriber_queue.length;
                    for (let i = 0; i < subscribers.length; i += 1) {
                        const s = subscribers[i];
                        s[1]();
                        subscriber_queue.push(s, value);
                    }
                    if (run_queue) {
                        for (let i = 0; i < subscriber_queue.length; i += 2) {
                            subscriber_queue[i][0](subscriber_queue[i + 1]);
                        }
                        subscriber_queue.length = 0;
                    }
                }
            }
        }
        function update(fn) {
            set(fn(value));
        }
        function subscribe(run, invalidate = noop) {
            const subscriber = [run, invalidate];
            subscribers.push(subscriber);
            if (subscribers.length === 1) {
                stop = start(set) || noop;
            }
            run(value);
            return () => {
                const index = subscribers.indexOf(subscriber);
                if (index !== -1) {
                    subscribers.splice(index, 1);
                }
                if (subscribers.length === 0) {
                    stop();
                    stop = null;
                }
            };
        }
        return { set, update, subscribe };
    }

    const CELL_TYPES = {
        EMPTY: {id: 0, isEditable: true},
        MOUNTAIN: {id: 1, isEditable: false},
        FOREST: {id: 2, isEditable: true},
        FIELD: {id: 3, isEditable: true},
        SEA: {id: 4, isEditable: true},
        VILLAGE: {id: 5, isEditable: true},
        MONSTER: {id: 6, isEditable: true},
        CREVASSE: {id: 7, isEditable: false}
    };

    const selectableTypes = () => {
        return Object.values(CELL_TYPES).filter(t => t.isEditable);
    };

    const isEditable = (id) => {
        return Object.values(CELL_TYPES).filter(t => t.id == id && t.isEditable).length > 0;
    };

    const isCellSurrounded = (id) => {
        let cpl = get_store_value(cellsPerLine);
        let cs = get_store_value(cells);

        let isTopOccupied = id < cpl || cs[id - cpl].type != CELL_TYPES.EMPTY.id;
        let isBotOccupied = id > cs.length - cpl || cs[id + cpl].type != CELL_TYPES.EMPTY.id;
        let isLeftOccupied = id%cpl == 0 || cs[id - 1].type != CELL_TYPES.EMPTY.id;
        let isRightOccupied = id%cpl == cpl - 1 || cs[id + 1].type != CELL_TYPES.EMPTY.id;

        return isTopOccupied && isRightOccupied && isBotOccupied && isLeftOccupied;
    };

    const initBoardA = () => {
        let array = initBoard(121);

        // Add mountains
        array[14].type = CELL_TYPES.MOUNTAIN.id;
        array[30].type = CELL_TYPES.MOUNTAIN.id;
        array[60].type = CELL_TYPES.MOUNTAIN.id;
        array[90].type = CELL_TYPES.MOUNTAIN.id;
        array[106].type = CELL_TYPES.MOUNTAIN.id;

        // Add ruins
        array[16].isRuins = true;
        array[23].isRuins = true;
        array[23].isRuins = true;
        array[31].isRuins = true;
        array[89].isRuins = true;
        array[97].isRuins = true;
        array[104].isRuins = true;

        return array;
    };

    const initBoard = (length = 121) => {
        return Array.from({length}, (v,i) => initCell(i, CELL_TYPES.EMPTY.id));
    };

    const initCell = (id, type = CELL_TYPES.EMPTY.id, isRuins = false) => {
        return {id, type, isRuins}
    };

    const rules = [   
        {
            id: 26, 
            type: "forest", 
            name: "Bois de la Sentinelle", 
            desc: "Gagnez une étoile de réputation pour chaque case Forêt adjacente au bord du parchemin.",
            calc: (cells, cellsPerLine) => cells.filter(c => c.type == CELL_TYPES.FOREST.id && (c.id % cellsPerLine == 0 || c.id < cellsPerLine || c.id % cellsPerLine == cellsPerLine - 1 || c.id >= cells.length - cellsPerLine)).length
        },
        {
            id: 27, 
            type: "forest", 
            name: "Chemin Verdoyant", 
            desc: "Gagnez une étoile de réputation pour chaque ligne ou colonne ayant au moins une case Forêt. La même case Forêt peut être décomptée à la fois pour une ligne et pour une colonne.",
            calc: (cells, cellsPerLine) => cells.filter(c => c.type == CELL_TYPES.FOREST.id).map(c => [c.id%cellsPerLine +1, -Math.trunc(c.id/cellsPerLine) -1]).flat(1).filter((c, index, a) => a.indexOf(c) == index).length
        },
        {
            id: 28, 
            type: "forest", 
            name: "Arbres-Vigies", 
            desc: "Gagnez une étoile de réputation pour chaque case Forêt entourée sur ses quatres côtés par une case remplies ou par le bord du parchemin.",
            calc: (cells, cellsPerLine) => cells.filter(c => c.type == CELL_TYPES.FOREST.id && (c.id < cellsPerLine || cells[c.id - cellsPerLine].type != CELL_TYPES.EMPTY.id) && (c.id > cells.length - cellsPerLine || cells[c.id + cellsPerLine].type != CELL_TYPES.EMPTY.id) && (c.id % cellsPerLine == 0 || cells[c.id -1].type != CELL_TYPES.EMPTY.id) && (c.id % cellsPerLine == cellsPerLine -1 || cells[c.id +1].type != CELL_TYPES.EMPTY.id)).length
        },
        {
            id: 29, 
            type: "forest", 
            name: "Forêt des Hauts Plateaux", 
            desc: "Gagnez trois étoiles de réputation pour chaque case Montagne connectées à une autre case Montagne par une région de Forêts.",
        },

        {
            id: 30, 
            type: "field-sea", 
            name: "Cannaux d'Irrigation", 
            desc: "Gagnez une étoile de réputation pour chaque case Lac adjacente à au moins une Ferme. Gagnez une étoile de réputation pour chaque case Ferme adjacente à au moins une case Lac.",
            calc: (cells, cellsPerLine) => cells.filter(c => (c.type == CELL_TYPES.SEA.id && ((c.id < cellsPerLine ? false : cells[c.id - cellsPerLine].type == CELL_TYPES.FIELD.id) || (c.id > cells.length - cellsPerLine ? false : cells[c.id + cellsPerLine].type == CELL_TYPES.FIELD.id) || (c.id % cellsPerLine == 0 ? false : cells[c.id -1].type == CELL_TYPES.FIELD.id) || (c.id % cellsPerLine == cellsPerLine -1 ? false : cells[c.id +1].type == CELL_TYPES.FIELD.id))) || (c.type == CELL_TYPES.FIELD.id && ((c.id < cellsPerLine ? false : cells[c.id - cellsPerLine].type == CELL_TYPES.SEA.id) || (c.id > cells.length - cellsPerLine ? false : cells[c.id + cellsPerLine].type == CELL_TYPES.SEA.id) || (c.id % cellsPerLine == 0 ? false : cells[c.id -1].type == CELL_TYPES.SEA.id) || (c.id % cellsPerLine == cellsPerLine -1 ? false : cells[c.id +1].type == CELL_TYPES.SEA.id)))).length
        },
        {
            id: 31, 
            type: "field-sea", 
            name: "Vallée des Mages", 
            desc: "Gagnez une étoile de réputation pour chaque case Lac adjacente à une case Montagne. Gagnez une étoile de réputation pour chaque case Ferme adjacente à une case à une case Montagne.",
            calc: (cells, cellsPerLine) => cells.filter(c => (c.type == CELL_TYPES.SEA.id && ((c.id < cellsPerLine ? false : cells[c.id - cellsPerLine].type == CELL_TYPES.MOUNTAIN.id) || (c.id > cells.length - cellsPerLine ? false : cells[c.id + cellsPerLine].type == CELL_TYPES.MOUNTAIN.id) || (c.id % cellsPerLine == 0 ? false : cells[c.id -1].type == CELL_TYPES.MOUNTAIN.id) || (c.id % cellsPerLine == cellsPerLine -1 ? false : cells[c.id +1].type == CELL_TYPES.MOUNTAIN.id))) || (c.type == CELL_TYPES.FIELD.id && ((c.id < cellsPerLine ? false : cells[c.id - cellsPerLine].type == CELL_TYPES.MOUNTAIN.id) || (c.id > cells.length - cellsPerLine ? false : cells[c.id + cellsPerLine].type == CELL_TYPES.MOUNTAIN.id) || (c.id % cellsPerLine == 0 ? false : cells[c.id -1].type == CELL_TYPES.MOUNTAIN.id) || (c.id % cellsPerLine == cellsPerLine -1 ? false : cells[c.id +1].type == CELL_TYPES.MOUNTAIN.id)))).length
        },
        {
            id: 32, 
            type: "field-sea", 
            name: "Grenier Doré", 
            desc: "Gagnez une étoile de réputation pour chaque case Lac adjacente à une case Ruines. Gagnez trois étoiles de réputation pour chaque case Ferme sur une case Ruines.",
            calc: (cells, cellsPerLine) => cells.filter(c => (c.type == CELL_TYPES.SEA.id && ((c.id < cellsPerLine ? false : cells[c.id - cellsPerLine].isRuins) || (c.id > cells.length - cellsPerLine ? false : cells[c.id + cellsPerLine].isRuins) || (c.id % cellsPerLine == 0 ? false : cells[c.id -1].isRuins) || (c.id % cellsPerLine == cellsPerLine -1 ? false : cells[c.id +1].isRuins)))).length + cells.filter(c => c.type == CELL_TYPES.FIELD.id && cells[c.id].isRuins).length*3
        },
        {
            id: 33, 
            type: "field-sea", 
            name: "Montée des Eaux", 
            desc: "Gagnez trois étoiles de réputation pour chaque région de Ferme qui n'est adjacente ni à une case Lac ni au bord du parchemin. Gagnez trois étoiles de réputation pour chaque région de Lacs qui n'est adjacente ni à une case Ferme ni au bord du parchemin."
        },

        {
            id: 34, 
            type: "village", 
            name:"Places Fortes", 
            desc: "Gagnez huit étoiles de réputationpour chaque région de six Villages ou plus."
        },
        {
            id: 35, 
            type: "village", 
            name:"Grande Cité", 
            desc: "Gagnez une étoile de réputation pour chaque case Village dans la plus grande région de Village qui n'est pas adjacente à une case montagne."
        },
        {
            id: 36, 
            type: "village", 
            name:"Plaines de l'Or Vert", 
            desc: "Gagnez trois étoiles de réputation pour chaque région de villages adjacente à au moins trois types de terrains différents."
        },
        {
            id: 37, 
            type: "village", 
            name:"Remparts", 
            desc: "Gagnez deux étoiles de réputation pour chaque case Village dans la deuxième plus grande régions de villages. En cas d'égalité, ne décomptez qu'une seule des régions concernées."
        },
     
        {
            id: 38, 
            type: "board",
            name: "Frontières", 
            desc: "Gagnez six étoiles de réputation pour chaque ligne complète et chaque colonne complète de cases remplies.",
            calc: (cells, cellsPerLine) => (cellsPerLine + cells.length/cellsPerLine - cells.filter(c => c.type == CELL_TYPES.EMPTY.id).map(c => [c.id%cellsPerLine +1, -Math.trunc(c.id/cellsPerLine) -1]).flat(1).filter((c, index, a) => a.indexOf(c) == index).length) *6
        },
        {
            id: 39, 
            type: "board", 
            name: "Baronnie Perdue", 
            desc: "Gagnez trois étoiles de réputation pour chaque case constituant l'un des bords du plus grand carré ce cases remplies."
        },
        {
            id: 40, 
            type: "board", 
            name: "Route Brisée", 
            desc: "Gagnez trois étoiles de réputation pour chaque ligne diagonale de cases remplie qui touchent le bord gauche et le bord inférieur du parchemin."
        },
        {
            id: 41, 
            type: "board", 
            name: "Chaudrons", 
            desc: "Gagnez une étoile de réputation pour chaque case vierge entourée de ses quatre côtés par une case remplies ou par le bord du parchemin.",
            calc: (cells, cellsPerLine) => cells.filter(c => c.type == CELL_TYPES.EMPTY.id && (c.id < cellsPerLine || cells[c.id - cellsPerLine].type != CELL_TYPES.EMPTY.id) && (c.id > cells.length - cellsPerLine || cells[c.id + cellsPerLine].type != CELL_TYPES.EMPTY.id) && (c.id % cellsPerLine == 0 || cells[c.id -1].type != CELL_TYPES.EMPTY.id) && (c.id % cellsPerLine == cellsPerLine -1 || cells[c.id +1].type != CELL_TYPES.EMPTY.id)).length
        },
    ];

    const cells = writable(initBoardA());
    const coins = writable(0);
    const cellsPerLine = writable(11);

    cells.subscribe((currentCells) => {
        currentCells.filter(c => c.type === CELL_TYPES.MOUNTAIN.id && !c.coinEarn)
                    .forEach(c => {
                        if(isCellSurrounded(c.id)) {
                            c.coinEarn = true;
                            coins.set(get_store_value(coins) +1);
                        }

                        console.log("============================");
                        rules.forEach(r => {
                            if(r.calc) console.log(r.name, r.calc(currentCells, get_store_value(cellsPerLine)));
                        });
                    });
    });

    /* src/components/cell.svelte generated by Svelte v3.38.2 */
    const file$8 = "src/components/cell.svelte";

    function create_fragment$b(ctx) {
    	let button;
    	let div;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			button = element("button");
    			div = element("div");
    			attr_dev(div, "class", "cell svelte-22lbpl");
    			toggle_class(div, "cell-mountain", /*data*/ ctx[0].type == CELL_TYPES.MOUNTAIN.id);
    			toggle_class(div, "cell-forest", /*data*/ ctx[0].type == CELL_TYPES.FOREST.id);
    			toggle_class(div, "cell-field", /*data*/ ctx[0].type == CELL_TYPES.FIELD.id);
    			toggle_class(div, "cell-sea", /*data*/ ctx[0].type == CELL_TYPES.SEA.id);
    			toggle_class(div, "cell-village", /*data*/ ctx[0].type == CELL_TYPES.VILLAGE.id);
    			toggle_class(div, "cell-monster", /*data*/ ctx[0].type == CELL_TYPES.MONSTER.id);
    			toggle_class(div, "cell-crevasse", /*data*/ ctx[0].type == CELL_TYPES.CREVASSE.id);
    			toggle_class(div, "cell-ruins", /*data*/ ctx[0].isRuins);
    			toggle_class(div, "cell-top", /*isFisrtLine*/ ctx[2]);
    			toggle_class(div, "cell-bottom", /*isLastLine*/ ctx[4]);
    			toggle_class(div, "cell-left", /*isFisrtCol*/ ctx[3]);
    			toggle_class(div, "cell-right", /*isLastCol*/ ctx[5]);
    			add_location(div, file$8, 17, 4, 451);
    			attr_dev(button, "class", "cell-container svelte-22lbpl");
    			set_style(button, "flex-basis", 100 / /*cellsPerLine*/ ctx[1] + "%");
    			add_location(button, file$8, 16, 0, 355);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, button, anchor);
    			append_dev(button, div);

    			if (!mounted) {
    				dispose = listen_dev(
    					button,
    					"click",
    					function () {
    						if (is_function(/*click*/ ctx[6])) /*click*/ ctx[6].apply(this, arguments);
    					},
    					false,
    					false,
    					false
    				);

    				mounted = true;
    			}
    		},
    		p: function update(new_ctx, [dirty]) {
    			ctx = new_ctx;

    			if (dirty & /*data, CELL_TYPES*/ 1) {
    				toggle_class(div, "cell-mountain", /*data*/ ctx[0].type == CELL_TYPES.MOUNTAIN.id);
    			}

    			if (dirty & /*data, CELL_TYPES*/ 1) {
    				toggle_class(div, "cell-forest", /*data*/ ctx[0].type == CELL_TYPES.FOREST.id);
    			}

    			if (dirty & /*data, CELL_TYPES*/ 1) {
    				toggle_class(div, "cell-field", /*data*/ ctx[0].type == CELL_TYPES.FIELD.id);
    			}

    			if (dirty & /*data, CELL_TYPES*/ 1) {
    				toggle_class(div, "cell-sea", /*data*/ ctx[0].type == CELL_TYPES.SEA.id);
    			}

    			if (dirty & /*data, CELL_TYPES*/ 1) {
    				toggle_class(div, "cell-village", /*data*/ ctx[0].type == CELL_TYPES.VILLAGE.id);
    			}

    			if (dirty & /*data, CELL_TYPES*/ 1) {
    				toggle_class(div, "cell-monster", /*data*/ ctx[0].type == CELL_TYPES.MONSTER.id);
    			}

    			if (dirty & /*data, CELL_TYPES*/ 1) {
    				toggle_class(div, "cell-crevasse", /*data*/ ctx[0].type == CELL_TYPES.CREVASSE.id);
    			}

    			if (dirty & /*data*/ 1) {
    				toggle_class(div, "cell-ruins", /*data*/ ctx[0].isRuins);
    			}

    			if (dirty & /*isFisrtLine*/ 4) {
    				toggle_class(div, "cell-top", /*isFisrtLine*/ ctx[2]);
    			}

    			if (dirty & /*isLastLine*/ 16) {
    				toggle_class(div, "cell-bottom", /*isLastLine*/ ctx[4]);
    			}

    			if (dirty & /*isFisrtCol*/ 8) {
    				toggle_class(div, "cell-left", /*isFisrtCol*/ ctx[3]);
    			}

    			if (dirty & /*isLastCol*/ 32) {
    				toggle_class(div, "cell-right", /*isLastCol*/ ctx[5]);
    			}

    			if (dirty & /*cellsPerLine*/ 2) {
    				set_style(button, "flex-basis", 100 / /*cellsPerLine*/ ctx[1] + "%");
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(button);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$b.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$b($$self, $$props, $$invalidate) {
    	let $cpl;
    	validate_store(cellsPerLine, "cpl");
    	component_subscribe($$self, cellsPerLine, $$value => $$invalidate(7, $cpl = $$value));
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("Cell", slots, []);
    	let { data = {} } = $$props;
    	let { cellsPerLine: cellsPerLine$1 = $cpl } = $$props;
    	let { isFisrtLine = false } = $$props;
    	let { isFisrtCol = false } = $$props;
    	let { isLastLine = false } = $$props;
    	let { isLastCol = false } = $$props;
    	let { click } = $$props;

    	const writable_props = [
    		"data",
    		"cellsPerLine",
    		"isFisrtLine",
    		"isFisrtCol",
    		"isLastLine",
    		"isLastCol",
    		"click"
    	];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<Cell> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ("data" in $$props) $$invalidate(0, data = $$props.data);
    		if ("cellsPerLine" in $$props) $$invalidate(1, cellsPerLine$1 = $$props.cellsPerLine);
    		if ("isFisrtLine" in $$props) $$invalidate(2, isFisrtLine = $$props.isFisrtLine);
    		if ("isFisrtCol" in $$props) $$invalidate(3, isFisrtCol = $$props.isFisrtCol);
    		if ("isLastLine" in $$props) $$invalidate(4, isLastLine = $$props.isLastLine);
    		if ("isLastCol" in $$props) $$invalidate(5, isLastCol = $$props.isLastCol);
    		if ("click" in $$props) $$invalidate(6, click = $$props.click);
    	};

    	$$self.$capture_state = () => ({
    		cpl: cellsPerLine,
    		CELL_TYPES,
    		data,
    		cellsPerLine: cellsPerLine$1,
    		isFisrtLine,
    		isFisrtCol,
    		isLastLine,
    		isLastCol,
    		click,
    		$cpl
    	});

    	$$self.$inject_state = $$props => {
    		if ("data" in $$props) $$invalidate(0, data = $$props.data);
    		if ("cellsPerLine" in $$props) $$invalidate(1, cellsPerLine$1 = $$props.cellsPerLine);
    		if ("isFisrtLine" in $$props) $$invalidate(2, isFisrtLine = $$props.isFisrtLine);
    		if ("isFisrtCol" in $$props) $$invalidate(3, isFisrtCol = $$props.isFisrtCol);
    		if ("isLastLine" in $$props) $$invalidate(4, isLastLine = $$props.isLastLine);
    		if ("isLastCol" in $$props) $$invalidate(5, isLastCol = $$props.isLastCol);
    		if ("click" in $$props) $$invalidate(6, click = $$props.click);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [data, cellsPerLine$1, isFisrtLine, isFisrtCol, isLastLine, isLastCol, click];
    }

    class Cell extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$b, create_fragment$b, safe_not_equal, {
    			data: 0,
    			cellsPerLine: 1,
    			isFisrtLine: 2,
    			isFisrtCol: 3,
    			isLastLine: 4,
    			isLastCol: 5,
    			click: 6
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Cell",
    			options,
    			id: create_fragment$b.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*click*/ ctx[6] === undefined && !("click" in props)) {
    			console.warn("<Cell> was created without expected prop 'click'");
    		}
    	}

    	get data() {
    		throw new Error("<Cell>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set data(value) {
    		throw new Error("<Cell>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get cellsPerLine() {
    		throw new Error("<Cell>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set cellsPerLine(value) {
    		throw new Error("<Cell>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get isFisrtLine() {
    		throw new Error("<Cell>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set isFisrtLine(value) {
    		throw new Error("<Cell>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get isFisrtCol() {
    		throw new Error("<Cell>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set isFisrtCol(value) {
    		throw new Error("<Cell>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get isLastLine() {
    		throw new Error("<Cell>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set isLastLine(value) {
    		throw new Error("<Cell>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get isLastCol() {
    		throw new Error("<Cell>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set isLastCol(value) {
    		throw new Error("<Cell>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get click() {
    		throw new Error("<Cell>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set click(value) {
    		throw new Error("<Cell>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    const isOpen = writable(false);
    const selectedCell = writable(null);

    /* src/components/board.svelte generated by Svelte v3.38.2 */
    const file$7 = "src/components/board.svelte";

    function get_each_context$2(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[6] = list[i];
    	child_ctx[8] = i;
    	return child_ctx;
    }

    // (15:0) {#each $cells as cell, index}
    function create_each_block$2(ctx) {
    	let cell;
    	let current;

    	function func() {
    		return /*func*/ ctx[3](/*cell*/ ctx[6]);
    	}

    	cell = new Cell({
    			props: {
    				click: func,
    				data: /*cell*/ ctx[6],
    				isFisrtCol: /*index*/ ctx[8] % /*$cellsPerLine*/ ctx[1] == 0,
    				isFisrtLine: /*index*/ ctx[8] < /*$cellsPerLine*/ ctx[1],
    				isLastCol: /*index*/ ctx[8] % /*$cellsPerLine*/ ctx[1] == /*$cellsPerLine*/ ctx[1] - 1,
    				isLastLine: /*index*/ ctx[8] >= /*$cells*/ ctx[0].length - /*$cellsPerLine*/ ctx[1]
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(cell.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(cell, target, anchor);
    			current = true;
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;
    			const cell_changes = {};
    			if (dirty & /*$cells*/ 1) cell_changes.click = func;
    			if (dirty & /*$cells*/ 1) cell_changes.data = /*cell*/ ctx[6];
    			if (dirty & /*$cellsPerLine*/ 2) cell_changes.isFisrtCol = /*index*/ ctx[8] % /*$cellsPerLine*/ ctx[1] == 0;
    			if (dirty & /*$cellsPerLine*/ 2) cell_changes.isFisrtLine = /*index*/ ctx[8] < /*$cellsPerLine*/ ctx[1];
    			if (dirty & /*$cellsPerLine*/ 2) cell_changes.isLastCol = /*index*/ ctx[8] % /*$cellsPerLine*/ ctx[1] == /*$cellsPerLine*/ ctx[1] - 1;
    			if (dirty & /*$cells, $cellsPerLine*/ 3) cell_changes.isLastLine = /*index*/ ctx[8] >= /*$cells*/ ctx[0].length - /*$cellsPerLine*/ ctx[1];
    			cell.$set(cell_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(cell.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(cell.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(cell, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$2.name,
    		type: "each",
    		source: "(15:0) {#each $cells as cell, index}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$a(ctx) {
    	let div;
    	let current;
    	let each_value = /*$cells*/ ctx[0];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$2(get_each_context$2(ctx, each_value, i));
    	}

    	const out = i => transition_out(each_blocks[i], 1, 1, () => {
    		each_blocks[i] = null;
    	});

    	const block = {
    		c: function create() {
    			div = element("div");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			attr_dev(div, "class", "board svelte-17xpoxu");
    			add_location(div, file$7, 13, 0, 353);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(div, null);
    			}

    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*selectCellType, $cells, $cellsPerLine*/ 7) {
    				each_value = /*$cells*/ ctx[0];
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$2(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    						transition_in(each_blocks[i], 1);
    					} else {
    						each_blocks[i] = create_each_block$2(child_ctx);
    						each_blocks[i].c();
    						transition_in(each_blocks[i], 1);
    						each_blocks[i].m(div, null);
    					}
    				}

    				group_outros();

    				for (i = each_value.length; i < each_blocks.length; i += 1) {
    					out(i);
    				}

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;

    			for (let i = 0; i < each_value.length; i += 1) {
    				transition_in(each_blocks[i]);
    			}

    			current = true;
    		},
    		o: function outro(local) {
    			each_blocks = each_blocks.filter(Boolean);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				transition_out(each_blocks[i]);
    			}

    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			destroy_each(each_blocks, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$a.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$a($$self, $$props, $$invalidate) {
    	let $isOpen;
    	let $selectedCell;
    	let $cells;
    	let $cellsPerLine;
    	validate_store(isOpen, "isOpen");
    	component_subscribe($$self, isOpen, $$value => $$invalidate(4, $isOpen = $$value));
    	validate_store(selectedCell, "selectedCell");
    	component_subscribe($$self, selectedCell, $$value => $$invalidate(5, $selectedCell = $$value));
    	validate_store(cells, "cells");
    	component_subscribe($$self, cells, $$value => $$invalidate(0, $cells = $$value));
    	validate_store(cellsPerLine, "cellsPerLine");
    	component_subscribe($$self, cellsPerLine, $$value => $$invalidate(1, $cellsPerLine = $$value));
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("Board", slots, []);

    	const selectCellType = c => {
    		if (isEditable(c.type)) set_store_value(isOpen, $isOpen = true, $isOpen);
    		set_store_value(selectedCell, $selectedCell = c.id, $selectedCell);
    	};

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<Board> was created with unknown prop '${key}'`);
    	});

    	const func = cell => selectCellType(cell);

    	$$self.$capture_state = () => ({
    		Cell,
    		cells,
    		cellsPerLine,
    		isOpen,
    		selectedCell,
    		isEditable,
    		selectCellType,
    		$isOpen,
    		$selectedCell,
    		$cells,
    		$cellsPerLine
    	});

    	return [$cells, $cellsPerLine, selectCellType, func];
    }

    class Board extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$a, create_fragment$a, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Board",
    			options,
    			id: create_fragment$a.name
    		});
    	}
    }

    /* node_modules/svelte-accessible-dialog/src/components/DialogPortal.svelte generated by Svelte v3.38.2 */
    const file$6 = "node_modules/svelte-accessible-dialog/src/components/DialogPortal.svelte";

    function create_fragment$9(ctx) {
    	let div;
    	let current;
    	const default_slot_template = /*#slots*/ ctx[2].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[1], null);

    	const block = {
    		c: function create() {
    			div = element("div");
    			if (default_slot) default_slot.c();
    			add_location(div, file$6, 20, 0, 445);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);

    			if (default_slot) {
    				default_slot.m(div, null);
    			}

    			/*div_binding*/ ctx[3](div);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope*/ 2)) {
    					update_slot(default_slot, default_slot_template, ctx, /*$$scope*/ ctx[1], dirty, null, null);
    				}
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			if (default_slot) default_slot.d(detaching);
    			/*div_binding*/ ctx[3](null);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$9.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$9($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("DialogPortal", slots, ['default']);
    	let ref;
    	let portal;

    	onMount(() => {
    		// Create and append a DOM node to `document.body`
    		// and render the component into it.
    		portal = document.createElement("div");

    		portal.setAttribute("data-svelte-dialog-portal", "true");
    		document.body.appendChild(portal);
    		portal.appendChild(ref);

    		return () => {
    			document.body.removeChild(portal);
    		};
    	});

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<DialogPortal> was created with unknown prop '${key}'`);
    	});

    	function div_binding($$value) {
    		binding_callbacks[$$value ? "unshift" : "push"](() => {
    			ref = $$value;
    			$$invalidate(0, ref);
    		});
    	}

    	$$self.$$set = $$props => {
    		if ("$$scope" in $$props) $$invalidate(1, $$scope = $$props.$$scope);
    	};

    	$$self.$capture_state = () => ({ onMount, ref, portal });

    	$$self.$inject_state = $$props => {
    		if ("ref" in $$props) $$invalidate(0, ref = $$props.ref);
    		if ("portal" in $$props) portal = $$props.portal;
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [ref, $$scope, slots, div_binding];
    }

    class DialogPortal extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$9, create_fragment$9, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "DialogPortal",
    			options,
    			id: create_fragment$9.name
    		});
    	}
    }

    /* node_modules/svelte-accessible-dialog/src/components/TrapScreenReader.svelte generated by Svelte v3.38.2 */

    function create_fragment$8(ctx) {
    	let current;
    	const default_slot_template = /*#slots*/ ctx[2].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[1], null);

    	const block = {
    		c: function create() {
    			if (default_slot) default_slot.c();
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			if (default_slot) {
    				default_slot.m(target, anchor);
    			}

    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope*/ 2)) {
    					update_slot(default_slot, default_slot_template, ctx, /*$$scope*/ ctx[1], dirty, null, null);
    				}
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (default_slot) default_slot.d(detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$8.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$8($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("TrapScreenReader", slots, ['default']);
    	let { enabled } = $$props;
    	let originalAttributes = [];

    	const hideFromScreenReader = node => {
    		originalAttributes.push({
    			ariaHidden: node.getAttribute("aria-hidden"),
    			inert: node.getAttribute("inert")
    		});

    		node.setAttribute("aria-hidden", "true");
    		node.setAttribute("inert", "true");
    	};

    	const exposeToScreenReader = (node, i) => {
    		const { ariaHidden, inert } = originalAttributes[i];

    		if (!ariaHidden) {
    			node.removeAttribute("aria-hidden");
    		} else {
    			node.setAttribute("aria-hidden", ariaHidden);
    		}

    		if (!inert) {
    			node.removeAttribute("inert");
    		}
    	};

    	onMount(() => {
    		if (!enabled) {
    			// `DialogContent` has the `aria-modal` attribute. This indicates to screen readers
    			// that only content contained within the dialog should be accessible to the user.
    			// Modern screen readers respect this attribute. In cases where support is inadequate,
    			// this legacy workaround can be enabled.
    			return;
    		}

    		// Grab all children in the `body` except for the dialog portal
    		const children = document.querySelectorAll("body > *:not([data-svelte-dialog-portal])");

    		children.forEach(hideFromScreenReader);

    		return () => {
    			children.forEach(exposeToScreenReader);
    		};
    	});

    	const writable_props = ["enabled"];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<TrapScreenReader> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ("enabled" in $$props) $$invalidate(0, enabled = $$props.enabled);
    		if ("$$scope" in $$props) $$invalidate(1, $$scope = $$props.$$scope);
    	};

    	$$self.$capture_state = () => ({
    		onMount,
    		enabled,
    		originalAttributes,
    		hideFromScreenReader,
    		exposeToScreenReader
    	});

    	$$self.$inject_state = $$props => {
    		if ("enabled" in $$props) $$invalidate(0, enabled = $$props.enabled);
    		if ("originalAttributes" in $$props) originalAttributes = $$props.originalAttributes;
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [enabled, $$scope, slots];
    }

    class TrapScreenReader extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$8, create_fragment$8, safe_not_equal, { enabled: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "TrapScreenReader",
    			options,
    			id: create_fragment$8.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*enabled*/ ctx[0] === undefined && !("enabled" in props)) {
    			console.warn("<TrapScreenReader> was created without expected prop 'enabled'");
    		}
    	}

    	get enabled() {
    		throw new Error("<TrapScreenReader>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set enabled(value) {
    		throw new Error("<TrapScreenReader>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* node_modules/svelte-accessible-dialog/src/components/TrapFocus.svelte generated by Svelte v3.38.2 */
    const file$5 = "node_modules/svelte-accessible-dialog/src/components/TrapFocus.svelte";

    function create_fragment$7(ctx) {
    	let div;
    	let current;
    	let mounted;
    	let dispose;
    	const default_slot_template = /*#slots*/ ctx[5].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[4], null);

    	const block = {
    		c: function create() {
    			div = element("div");
    			if (default_slot) default_slot.c();
    			add_location(div, file$5, 69, 0, 1782);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);

    			if (default_slot) {
    				default_slot.m(div, null);
    			}

    			/*div_binding*/ ctx[6](div);
    			current = true;

    			if (!mounted) {
    				dispose = listen_dev(window, "keydown", /*handleKeydown*/ ctx[1], false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope*/ 16)) {
    					update_slot(default_slot, default_slot_template, ctx, /*$$scope*/ ctx[4], dirty, null, null);
    				}
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			if (default_slot) default_slot.d(detaching);
    			/*div_binding*/ ctx[6](null);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$7.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$7($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("TrapFocus", slots, ['default']);
    	let { initialFocusElement } = $$props;
    	let { returnFocusElement } = $$props;
    	let ref;
    	let tabbableChildren;
    	let firstTabbableChild;
    	let lastTabbableChild;
    	let returnFocusElem;

    	onMount(() => {
    		returnFocusElem = returnFocusElement || document.activeElement;
    		tabbableChildren = [...ref.querySelectorAll("*")].filter(node => node.tabIndex >= 0);
    		firstTabbableChild = tabbableChildren[0];
    		lastTabbableChild = tabbableChildren[tabbableChildren.length - 1];

    		// Wait for children to mount before trying to focus `initialFocusElement`
    		tick().then(() => {
    			if (initialFocusElement) {
    				initialFocusElement.focus();
    			} else {
    				const initialFocusElem = ref.querySelector("[autofocus]") || firstTabbableChild || ref.querySelector("[data-svelte-dialog-content]");
    				initialFocusElem.focus();
    			}
    		});
    	});

    	onDestroy(() => {
    		if (returnFocusElem) {
    			returnFocusElem.focus();
    		}
    	});

    	// We can't test keyboard semantics in `jsdom`, so it doesn't
    	// make sense to include this function in the coverage report.
    	// istanbul ignore next
    	const handleKeydown = event => {
    		if (event.key !== "Tab") {
    			return;
    		}

    		if (tabbableChildren.length === 0) {
    			event.preventDefault();
    		}

    		if (event.shiftKey) {
    			// Handle shift + tab
    			if (document.activeElement === firstTabbableChild) {
    				event.preventDefault();
    				lastTabbableChild.focus();
    			}
    		} else {
    			if (document.activeElement === lastTabbableChild) {
    				event.preventDefault();
    				firstTabbableChild.focus();
    			}
    		}
    	};

    	const writable_props = ["initialFocusElement", "returnFocusElement"];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<TrapFocus> was created with unknown prop '${key}'`);
    	});

    	function div_binding($$value) {
    		binding_callbacks[$$value ? "unshift" : "push"](() => {
    			ref = $$value;
    			$$invalidate(0, ref);
    		});
    	}

    	$$self.$$set = $$props => {
    		if ("initialFocusElement" in $$props) $$invalidate(2, initialFocusElement = $$props.initialFocusElement);
    		if ("returnFocusElement" in $$props) $$invalidate(3, returnFocusElement = $$props.returnFocusElement);
    		if ("$$scope" in $$props) $$invalidate(4, $$scope = $$props.$$scope);
    	};

    	$$self.$capture_state = () => ({
    		onMount,
    		onDestroy,
    		tick,
    		initialFocusElement,
    		returnFocusElement,
    		ref,
    		tabbableChildren,
    		firstTabbableChild,
    		lastTabbableChild,
    		returnFocusElem,
    		handleKeydown
    	});

    	$$self.$inject_state = $$props => {
    		if ("initialFocusElement" in $$props) $$invalidate(2, initialFocusElement = $$props.initialFocusElement);
    		if ("returnFocusElement" in $$props) $$invalidate(3, returnFocusElement = $$props.returnFocusElement);
    		if ("ref" in $$props) $$invalidate(0, ref = $$props.ref);
    		if ("tabbableChildren" in $$props) tabbableChildren = $$props.tabbableChildren;
    		if ("firstTabbableChild" in $$props) firstTabbableChild = $$props.firstTabbableChild;
    		if ("lastTabbableChild" in $$props) lastTabbableChild = $$props.lastTabbableChild;
    		if ("returnFocusElem" in $$props) returnFocusElem = $$props.returnFocusElem;
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		ref,
    		handleKeydown,
    		initialFocusElement,
    		returnFocusElement,
    		$$scope,
    		slots,
    		div_binding
    	];
    }

    class TrapFocus extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$7, create_fragment$7, safe_not_equal, {
    			initialFocusElement: 2,
    			returnFocusElement: 3
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "TrapFocus",
    			options,
    			id: create_fragment$7.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*initialFocusElement*/ ctx[2] === undefined && !("initialFocusElement" in props)) {
    			console.warn("<TrapFocus> was created without expected prop 'initialFocusElement'");
    		}

    		if (/*returnFocusElement*/ ctx[3] === undefined && !("returnFocusElement" in props)) {
    			console.warn("<TrapFocus> was created without expected prop 'returnFocusElement'");
    		}
    	}

    	get initialFocusElement() {
    		throw new Error("<TrapFocus>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set initialFocusElement(value) {
    		throw new Error("<TrapFocus>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get returnFocusElement() {
    		throw new Error("<TrapFocus>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set returnFocusElement(value) {
    		throw new Error("<TrapFocus>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* node_modules/svelte-accessible-dialog/src/components/LockScroll.svelte generated by Svelte v3.38.2 */

    function create_fragment$6(ctx) {
    	let current;
    	const default_slot_template = /*#slots*/ ctx[1].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[0], null);

    	const block = {
    		c: function create() {
    			if (default_slot) default_slot.c();
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			if (default_slot) {
    				default_slot.m(target, anchor);
    			}

    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope*/ 1)) {
    					update_slot(default_slot, default_slot_template, ctx, /*$$scope*/ ctx[0], dirty, null, null);
    				}
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (default_slot) default_slot.d(detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$6.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$6($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("LockScroll", slots, ['default']);

    	onMount(() => {
    		const { body, documentElement: html } = document;
    		const scrollBarWidth = window.innerWidth - html.clientWidth;
    		const bodyPaddingRight = parseInt(window.getComputedStyle(body).getPropertyValue("padding-right")) || 0;

    		// 1. Fixes a bug in iOS and desktop Safari whereby setting `overflow: hidden` on
    		//    the html/body does not prevent scrolling.
    		// 2. Fixes a bug in desktop Safari where `overflowY` does not prevent scroll if an
    		//   `overflow-x` style is also applied to the body.
    		html.style.position = "relative"; // [1]

    		html.style.overflow = "hidden"; // [2]
    		body.style.position = "relative"; // [1]
    		body.style.overflow = "hidden"; // [2]
    		body.style.paddingRight = `${bodyPaddingRight + scrollBarWidth}px`;

    		return () => {
    			html.style.position = "";
    			html.style.overflow = "";
    			body.style.position = "";
    			body.style.overflow = "";
    			body.style.paddingRight = "";
    		};
    	});

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<LockScroll> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ("$$scope" in $$props) $$invalidate(0, $$scope = $$props.$$scope);
    	};

    	$$self.$capture_state = () => ({ onMount });
    	return [$$scope, slots];
    }

    class LockScroll extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$6, create_fragment$6, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "LockScroll",
    			options,
    			id: create_fragment$6.name
    		});
    	}
    }

    /* node_modules/svelte-accessible-dialog/src/components/DialogOverlayInner.svelte generated by Svelte v3.38.2 */
    const file$4 = "node_modules/svelte-accessible-dialog/src/components/DialogOverlayInner.svelte";

    // (39:4) <LockScroll>
    function create_default_slot_2(ctx) {
    	let div;
    	let current;
    	let mounted;
    	let dispose;
    	const default_slot_template = /*#slots*/ ctx[7].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[8], null);
    	let div_levels = [/*$$restProps*/ ctx[5], { "data-svelte-dialog-overlay": "" }];
    	let div_data = {};

    	for (let i = 0; i < div_levels.length; i += 1) {
    		div_data = assign(div_data, div_levels[i]);
    	}

    	const block = {
    		c: function create() {
    			div = element("div");
    			if (default_slot) default_slot.c();
    			set_attributes(div, div_data);
    			toggle_class(div, "svelte-64d8vk", true);
    			add_location(div, file$4, 39, 6, 798);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);

    			if (default_slot) {
    				default_slot.m(div, null);
    			}

    			current = true;

    			if (!mounted) {
    				dispose = listen_dev(div, "click", self(stop_propagation(/*handleClick*/ ctx[3])), false, false, true);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope*/ 256)) {
    					update_slot(default_slot, default_slot_template, ctx, /*$$scope*/ ctx[8], dirty, null, null);
    				}
    			}

    			set_attributes(div, div_data = get_spread_update(div_levels, [
    				dirty & /*$$restProps*/ 32 && /*$$restProps*/ ctx[5],
    				{ "data-svelte-dialog-overlay": "" }
    			]));

    			toggle_class(div, "svelte-64d8vk", true);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			if (default_slot) default_slot.d(detaching);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_2.name,
    		type: "slot",
    		source: "(39:4) <LockScroll>",
    		ctx
    	});

    	return block;
    }

    // (38:2) <TrapFocus {initialFocusElement} {returnFocusElement}>
    function create_default_slot_1$2(ctx) {
    	let lockscroll;
    	let current;

    	lockscroll = new LockScroll({
    			props: {
    				$$slots: { default: [create_default_slot_2] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(lockscroll.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(lockscroll, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const lockscroll_changes = {};

    			if (dirty & /*$$scope, $$restProps*/ 288) {
    				lockscroll_changes.$$scope = { dirty, ctx };
    			}

    			lockscroll.$set(lockscroll_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(lockscroll.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(lockscroll.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(lockscroll, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_1$2.name,
    		type: "slot",
    		source: "(38:2) <TrapFocus {initialFocusElement} {returnFocusElement}>",
    		ctx
    	});

    	return block;
    }

    // (37:0) <TrapScreenReader enabled={ariaModalLegacy}>
    function create_default_slot$2(ctx) {
    	let trapfocus;
    	let current;

    	trapfocus = new TrapFocus({
    			props: {
    				initialFocusElement: /*initialFocusElement*/ ctx[0],
    				returnFocusElement: /*returnFocusElement*/ ctx[1],
    				$$slots: { default: [create_default_slot_1$2] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(trapfocus.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(trapfocus, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const trapfocus_changes = {};
    			if (dirty & /*initialFocusElement*/ 1) trapfocus_changes.initialFocusElement = /*initialFocusElement*/ ctx[0];
    			if (dirty & /*returnFocusElement*/ 2) trapfocus_changes.returnFocusElement = /*returnFocusElement*/ ctx[1];

    			if (dirty & /*$$scope, $$restProps*/ 288) {
    				trapfocus_changes.$$scope = { dirty, ctx };
    			}

    			trapfocus.$set(trapfocus_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(trapfocus.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(trapfocus.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(trapfocus, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot$2.name,
    		type: "slot",
    		source: "(37:0) <TrapScreenReader enabled={ariaModalLegacy}>",
    		ctx
    	});

    	return block;
    }

    function create_fragment$5(ctx) {
    	let trapscreenreader;
    	let current;
    	let mounted;
    	let dispose;

    	trapscreenreader = new TrapScreenReader({
    			props: {
    				enabled: /*ariaModalLegacy*/ ctx[2],
    				$$slots: { default: [create_default_slot$2] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(trapscreenreader.$$.fragment);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			mount_component(trapscreenreader, target, anchor);
    			current = true;

    			if (!mounted) {
    				dispose = listen_dev(window, "keydown", /*handleKeydown*/ ctx[4], false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			const trapscreenreader_changes = {};
    			if (dirty & /*ariaModalLegacy*/ 4) trapscreenreader_changes.enabled = /*ariaModalLegacy*/ ctx[2];

    			if (dirty & /*$$scope, initialFocusElement, returnFocusElement, $$restProps*/ 291) {
    				trapscreenreader_changes.$$scope = { dirty, ctx };
    			}

    			trapscreenreader.$set(trapscreenreader_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(trapscreenreader.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(trapscreenreader.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(trapscreenreader, detaching);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$5.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$5($$self, $$props, $$invalidate) {
    	const omit_props_names = ["onDismiss","initialFocusElement","returnFocusElement","ariaModalLegacy"];
    	let $$restProps = compute_rest_props($$props, omit_props_names);
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("DialogOverlayInner", slots, ['default']);
    	let { onDismiss } = $$props;
    	let { initialFocusElement } = $$props;
    	let { returnFocusElement } = $$props;
    	let { ariaModalLegacy } = $$props;

    	const handleClick = () => {
    		onDismiss();
    	};

    	const handleKeydown = event => {
    		if (event.key === "Escape") {
    			onDismiss();
    		}
    	};

    	$$self.$$set = $$new_props => {
    		$$props = assign(assign({}, $$props), exclude_internal_props($$new_props));
    		$$invalidate(5, $$restProps = compute_rest_props($$props, omit_props_names));
    		if ("onDismiss" in $$new_props) $$invalidate(6, onDismiss = $$new_props.onDismiss);
    		if ("initialFocusElement" in $$new_props) $$invalidate(0, initialFocusElement = $$new_props.initialFocusElement);
    		if ("returnFocusElement" in $$new_props) $$invalidate(1, returnFocusElement = $$new_props.returnFocusElement);
    		if ("ariaModalLegacy" in $$new_props) $$invalidate(2, ariaModalLegacy = $$new_props.ariaModalLegacy);
    		if ("$$scope" in $$new_props) $$invalidate(8, $$scope = $$new_props.$$scope);
    	};

    	$$self.$capture_state = () => ({
    		TrapScreenReader,
    		TrapFocus,
    		LockScroll,
    		onDismiss,
    		initialFocusElement,
    		returnFocusElement,
    		ariaModalLegacy,
    		handleClick,
    		handleKeydown
    	});

    	$$self.$inject_state = $$new_props => {
    		if ("onDismiss" in $$props) $$invalidate(6, onDismiss = $$new_props.onDismiss);
    		if ("initialFocusElement" in $$props) $$invalidate(0, initialFocusElement = $$new_props.initialFocusElement);
    		if ("returnFocusElement" in $$props) $$invalidate(1, returnFocusElement = $$new_props.returnFocusElement);
    		if ("ariaModalLegacy" in $$props) $$invalidate(2, ariaModalLegacy = $$new_props.ariaModalLegacy);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		initialFocusElement,
    		returnFocusElement,
    		ariaModalLegacy,
    		handleClick,
    		handleKeydown,
    		$$restProps,
    		onDismiss,
    		slots,
    		$$scope
    	];
    }

    class DialogOverlayInner extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$5, create_fragment$5, safe_not_equal, {
    			onDismiss: 6,
    			initialFocusElement: 0,
    			returnFocusElement: 1,
    			ariaModalLegacy: 2
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "DialogOverlayInner",
    			options,
    			id: create_fragment$5.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*onDismiss*/ ctx[6] === undefined && !("onDismiss" in props)) {
    			console.warn("<DialogOverlayInner> was created without expected prop 'onDismiss'");
    		}

    		if (/*initialFocusElement*/ ctx[0] === undefined && !("initialFocusElement" in props)) {
    			console.warn("<DialogOverlayInner> was created without expected prop 'initialFocusElement'");
    		}

    		if (/*returnFocusElement*/ ctx[1] === undefined && !("returnFocusElement" in props)) {
    			console.warn("<DialogOverlayInner> was created without expected prop 'returnFocusElement'");
    		}

    		if (/*ariaModalLegacy*/ ctx[2] === undefined && !("ariaModalLegacy" in props)) {
    			console.warn("<DialogOverlayInner> was created without expected prop 'ariaModalLegacy'");
    		}
    	}

    	get onDismiss() {
    		throw new Error("<DialogOverlayInner>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set onDismiss(value) {
    		throw new Error("<DialogOverlayInner>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get initialFocusElement() {
    		throw new Error("<DialogOverlayInner>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set initialFocusElement(value) {
    		throw new Error("<DialogOverlayInner>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get returnFocusElement() {
    		throw new Error("<DialogOverlayInner>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set returnFocusElement(value) {
    		throw new Error("<DialogOverlayInner>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get ariaModalLegacy() {
    		throw new Error("<DialogOverlayInner>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set ariaModalLegacy(value) {
    		throw new Error("<DialogOverlayInner>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* node_modules/svelte-accessible-dialog/src/components/DialogOverlay.svelte generated by Svelte v3.38.2 */

    // (13:0) {#if isOpen}
    function create_if_block(ctx) {
    	let dialogportal;
    	let current;

    	dialogportal = new DialogPortal({
    			props: {
    				$$slots: { default: [create_default_slot$1] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(dialogportal.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(dialogportal, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const dialogportal_changes = {};

    			if (dirty & /*$$scope, $$restProps, onDismiss, initialFocusElement, returnFocusElement, ariaModalLegacy*/ 190) {
    				dialogportal_changes.$$scope = { dirty, ctx };
    			}

    			dialogportal.$set(dialogportal_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(dialogportal.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(dialogportal.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(dialogportal, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block.name,
    		type: "if",
    		source: "(13:0) {#if isOpen}",
    		ctx
    	});

    	return block;
    }

    // (15:4) <DialogOverlayInner       {...$$restProps}       {onDismiss}       {initialFocusElement}       {returnFocusElement}       {ariaModalLegacy}     >
    function create_default_slot_1$1(ctx) {
    	let current;
    	const default_slot_template = /*#slots*/ ctx[6].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[7], null);

    	const block = {
    		c: function create() {
    			if (default_slot) default_slot.c();
    		},
    		m: function mount(target, anchor) {
    			if (default_slot) {
    				default_slot.m(target, anchor);
    			}

    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope*/ 128)) {
    					update_slot(default_slot, default_slot_template, ctx, /*$$scope*/ ctx[7], dirty, null, null);
    				}
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (default_slot) default_slot.d(detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_1$1.name,
    		type: "slot",
    		source: "(15:4) <DialogOverlayInner       {...$$restProps}       {onDismiss}       {initialFocusElement}       {returnFocusElement}       {ariaModalLegacy}     >",
    		ctx
    	});

    	return block;
    }

    // (14:2) <DialogPortal>
    function create_default_slot$1(ctx) {
    	let dialogoverlayinner;
    	let current;

    	const dialogoverlayinner_spread_levels = [
    		/*$$restProps*/ ctx[5],
    		{ onDismiss: /*onDismiss*/ ctx[1] },
    		{
    			initialFocusElement: /*initialFocusElement*/ ctx[2]
    		},
    		{
    			returnFocusElement: /*returnFocusElement*/ ctx[3]
    		},
    		{
    			ariaModalLegacy: /*ariaModalLegacy*/ ctx[4]
    		}
    	];

    	let dialogoverlayinner_props = {
    		$$slots: { default: [create_default_slot_1$1] },
    		$$scope: { ctx }
    	};

    	for (let i = 0; i < dialogoverlayinner_spread_levels.length; i += 1) {
    		dialogoverlayinner_props = assign(dialogoverlayinner_props, dialogoverlayinner_spread_levels[i]);
    	}

    	dialogoverlayinner = new DialogOverlayInner({
    			props: dialogoverlayinner_props,
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(dialogoverlayinner.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(dialogoverlayinner, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const dialogoverlayinner_changes = (dirty & /*$$restProps, onDismiss, initialFocusElement, returnFocusElement, ariaModalLegacy*/ 62)
    			? get_spread_update(dialogoverlayinner_spread_levels, [
    					dirty & /*$$restProps*/ 32 && get_spread_object(/*$$restProps*/ ctx[5]),
    					dirty & /*onDismiss*/ 2 && { onDismiss: /*onDismiss*/ ctx[1] },
    					dirty & /*initialFocusElement*/ 4 && {
    						initialFocusElement: /*initialFocusElement*/ ctx[2]
    					},
    					dirty & /*returnFocusElement*/ 8 && {
    						returnFocusElement: /*returnFocusElement*/ ctx[3]
    					},
    					dirty & /*ariaModalLegacy*/ 16 && {
    						ariaModalLegacy: /*ariaModalLegacy*/ ctx[4]
    					}
    				])
    			: {};

    			if (dirty & /*$$scope*/ 128) {
    				dialogoverlayinner_changes.$$scope = { dirty, ctx };
    			}

    			dialogoverlayinner.$set(dialogoverlayinner_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(dialogoverlayinner.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(dialogoverlayinner.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(dialogoverlayinner, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot$1.name,
    		type: "slot",
    		source: "(14:2) <DialogPortal>",
    		ctx
    	});

    	return block;
    }

    function create_fragment$4(ctx) {
    	let if_block_anchor;
    	let current;
    	let if_block = /*isOpen*/ ctx[0] && create_if_block(ctx);

    	const block = {
    		c: function create() {
    			if (if_block) if_block.c();
    			if_block_anchor = empty();
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			if (if_block) if_block.m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (/*isOpen*/ ctx[0]) {
    				if (if_block) {
    					if_block.p(ctx, dirty);

    					if (dirty & /*isOpen*/ 1) {
    						transition_in(if_block, 1);
    					}
    				} else {
    					if_block = create_if_block(ctx);
    					if_block.c();
    					transition_in(if_block, 1);
    					if_block.m(if_block_anchor.parentNode, if_block_anchor);
    				}
    			} else if (if_block) {
    				group_outros();

    				transition_out(if_block, 1, 1, () => {
    					if_block = null;
    				});

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (if_block) if_block.d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$4.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$4($$self, $$props, $$invalidate) {
    	const omit_props_names = [
    		"isOpen","onDismiss","initialFocusElement","returnFocusElement","ariaModalLegacy"
    	];

    	let $$restProps = compute_rest_props($$props, omit_props_names);
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("DialogOverlay", slots, ['default']);
    	let { isOpen } = $$props;
    	let { onDismiss } = $$props;
    	let { initialFocusElement = null } = $$props;
    	let { returnFocusElement = null } = $$props;
    	let { ariaModalLegacy = false } = $$props;

    	$$self.$$set = $$new_props => {
    		$$props = assign(assign({}, $$props), exclude_internal_props($$new_props));
    		$$invalidate(5, $$restProps = compute_rest_props($$props, omit_props_names));
    		if ("isOpen" in $$new_props) $$invalidate(0, isOpen = $$new_props.isOpen);
    		if ("onDismiss" in $$new_props) $$invalidate(1, onDismiss = $$new_props.onDismiss);
    		if ("initialFocusElement" in $$new_props) $$invalidate(2, initialFocusElement = $$new_props.initialFocusElement);
    		if ("returnFocusElement" in $$new_props) $$invalidate(3, returnFocusElement = $$new_props.returnFocusElement);
    		if ("ariaModalLegacy" in $$new_props) $$invalidate(4, ariaModalLegacy = $$new_props.ariaModalLegacy);
    		if ("$$scope" in $$new_props) $$invalidate(7, $$scope = $$new_props.$$scope);
    	};

    	$$self.$capture_state = () => ({
    		DialogPortal,
    		DialogOverlayInner,
    		isOpen,
    		onDismiss,
    		initialFocusElement,
    		returnFocusElement,
    		ariaModalLegacy
    	});

    	$$self.$inject_state = $$new_props => {
    		if ("isOpen" in $$props) $$invalidate(0, isOpen = $$new_props.isOpen);
    		if ("onDismiss" in $$props) $$invalidate(1, onDismiss = $$new_props.onDismiss);
    		if ("initialFocusElement" in $$props) $$invalidate(2, initialFocusElement = $$new_props.initialFocusElement);
    		if ("returnFocusElement" in $$props) $$invalidate(3, returnFocusElement = $$new_props.returnFocusElement);
    		if ("ariaModalLegacy" in $$props) $$invalidate(4, ariaModalLegacy = $$new_props.ariaModalLegacy);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		isOpen,
    		onDismiss,
    		initialFocusElement,
    		returnFocusElement,
    		ariaModalLegacy,
    		$$restProps,
    		slots,
    		$$scope
    	];
    }

    class DialogOverlay extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$4, create_fragment$4, safe_not_equal, {
    			isOpen: 0,
    			onDismiss: 1,
    			initialFocusElement: 2,
    			returnFocusElement: 3,
    			ariaModalLegacy: 4
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "DialogOverlay",
    			options,
    			id: create_fragment$4.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*isOpen*/ ctx[0] === undefined && !("isOpen" in props)) {
    			console.warn("<DialogOverlay> was created without expected prop 'isOpen'");
    		}

    		if (/*onDismiss*/ ctx[1] === undefined && !("onDismiss" in props)) {
    			console.warn("<DialogOverlay> was created without expected prop 'onDismiss'");
    		}
    	}

    	get isOpen() {
    		throw new Error("<DialogOverlay>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set isOpen(value) {
    		throw new Error("<DialogOverlay>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get onDismiss() {
    		throw new Error("<DialogOverlay>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set onDismiss(value) {
    		throw new Error("<DialogOverlay>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get initialFocusElement() {
    		throw new Error("<DialogOverlay>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set initialFocusElement(value) {
    		throw new Error("<DialogOverlay>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get returnFocusElement() {
    		throw new Error("<DialogOverlay>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set returnFocusElement(value) {
    		throw new Error("<DialogOverlay>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get ariaModalLegacy() {
    		throw new Error("<DialogOverlay>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set ariaModalLegacy(value) {
    		throw new Error("<DialogOverlay>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* node_modules/svelte-accessible-dialog/src/components/DialogContent.svelte generated by Svelte v3.38.2 */

    const file$3 = "node_modules/svelte-accessible-dialog/src/components/DialogContent.svelte";

    function create_fragment$3(ctx) {
    	let div;
    	let current;
    	const default_slot_template = /*#slots*/ ctx[2].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[1], null);

    	let div_levels = [
    		/*$$restProps*/ ctx[0],
    		{ "data-svelte-dialog-content": "" },
    		{ "aria-modal": "true" },
    		{ role: "dialog" },
    		{ tabindex: "-1" }
    	];

    	let div_data = {};

    	for (let i = 0; i < div_levels.length; i += 1) {
    		div_data = assign(div_data, div_levels[i]);
    	}

    	const block = {
    		c: function create() {
    			div = element("div");
    			if (default_slot) default_slot.c();
    			set_attributes(div, div_data);
    			toggle_class(div, "svelte-1472bc8", true);
    			add_location(div, file$3, 10, 0, 137);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);

    			if (default_slot) {
    				default_slot.m(div, null);
    			}

    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope*/ 2)) {
    					update_slot(default_slot, default_slot_template, ctx, /*$$scope*/ ctx[1], dirty, null, null);
    				}
    			}

    			set_attributes(div, div_data = get_spread_update(div_levels, [
    				dirty & /*$$restProps*/ 1 && /*$$restProps*/ ctx[0],
    				{ "data-svelte-dialog-content": "" },
    				{ "aria-modal": "true" },
    				{ role: "dialog" },
    				{ tabindex: "-1" }
    			]));

    			toggle_class(div, "svelte-1472bc8", true);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			if (default_slot) default_slot.d(detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$3.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$3($$self, $$props, $$invalidate) {
    	const omit_props_names = [];
    	let $$restProps = compute_rest_props($$props, omit_props_names);
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("DialogContent", slots, ['default']);

    	$$self.$$set = $$new_props => {
    		$$props = assign(assign({}, $$props), exclude_internal_props($$new_props));
    		$$invalidate(0, $$restProps = compute_rest_props($$props, omit_props_names));
    		if ("$$scope" in $$new_props) $$invalidate(1, $$scope = $$new_props.$$scope);
    	};

    	return [$$restProps, $$scope, slots];
    }

    class DialogContent extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$3, create_fragment$3, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "DialogContent",
    			options,
    			id: create_fragment$3.name
    		});
    	}
    }

    /* src/components/modal.svelte generated by Svelte v3.38.2 */
    const file$2 = "src/components/modal.svelte";

    function get_each_context$1(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[8] = list[i];
    	return child_ctx;
    }

    // (29:16) {#each selectableTypes() as type}
    function create_each_block$1(ctx) {
    	let cell;
    	let current;

    	function func() {
    		return /*func*/ ctx[4](/*type*/ ctx[8]);
    	}

    	cell = new Cell({
    			props: {
    				data: initCell(0, /*type*/ ctx[8].id),
    				cellsPerLine: /*types*/ ctx[1].length / 2,
    				click: func
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(cell.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(cell, target, anchor);
    			current = true;
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(cell.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(cell.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(cell, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$1.name,
    		type: "each",
    		source: "(29:16) {#each selectableTypes() as type}",
    		ctx
    	});

    	return block;
    }

    // (24:4) <DialogContent aria-label="Announcement" class="content">
    function create_default_slot_1(ctx) {
    	let button;
    	let svg;
    	let g1;
    	let g0;
    	let rect;
    	let path;
    	let t0;
    	let h1;
    	let t2;
    	let p;
    	let t4;
    	let div;
    	let current;
    	let mounted;
    	let dispose;
    	let each_value = selectableTypes();
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$1(get_each_context$1(ctx, each_value, i));
    	}

    	const out = i => transition_out(each_blocks[i], 1, 1, () => {
    		each_blocks[i] = null;
    	});

    	const block = {
    		c: function create() {
    			button = element("button");
    			svg = svg_element("svg");
    			g1 = svg_element("g");
    			g0 = svg_element("g");
    			rect = svg_element("rect");
    			path = svg_element("path");
    			t0 = space();
    			h1 = element("h1");
    			h1.textContent = "Select type";
    			t2 = space();
    			p = element("p");
    			p.textContent = "Select the type the cell should be applied :";
    			t4 = space();
    			div = element("div");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			attr_dev(rect, "width", "24");
    			attr_dev(rect, "height", "24");
    			attr_dev(rect, "transform", "rotate(180 12 12)");
    			attr_dev(rect, "opacity", "0");
    			add_location(rect, file$2, 24, 201, 919);
    			attr_dev(path, "fill", "currentColor");
    			attr_dev(path, "d", "M13.41 12l4.3-4.29a1 1 0 1 0-1.42-1.42L12 10.59l-4.29-4.3a1 1 0 0 0-1.42 1.42l4.3 4.29-4.3 4.29a1 1 0 0 0 0 1.42 1 1 0 0 0 1.42 0l4.29-4.3 4.29 4.3a1 1 0 0 0 1.42 0 1 1 0 0 0 0-1.42z");
    			add_location(path, file$2, 24, 273, 991);
    			attr_dev(g0, "data-name", "close");
    			add_location(g0, file$2, 24, 180, 898);
    			attr_dev(g1, "data-name", "Layer 2");
    			add_location(g1, file$2, 24, 157, 875);
    			attr_dev(svg, "width", "100%");
    			attr_dev(svg, "height", "100%");
    			attr_dev(svg, "viewBox", "0 0 24 24");
    			attr_dev(svg, "xmlns", "http://www.w3.org/2000/svg");
    			add_location(svg, file$2, 24, 70, 788);
    			attr_dev(button, "class", "close svelte-1fq2idn");
    			attr_dev(button, "aria-label", "close");
    			add_location(button, file$2, 24, 12, 730);
    			attr_dev(h1, "class", "svelte-1fq2idn");
    			add_location(h1, file$2, 25, 12, 1241);
    			add_location(p, file$2, 26, 12, 1274);
    			attr_dev(div, "class", "cells svelte-1fq2idn");
    			add_location(div, file$2, 27, 12, 1339);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, button, anchor);
    			append_dev(button, svg);
    			append_dev(svg, g1);
    			append_dev(g1, g0);
    			append_dev(g0, rect);
    			append_dev(g0, path);
    			insert_dev(target, t0, anchor);
    			insert_dev(target, h1, anchor);
    			insert_dev(target, t2, anchor);
    			insert_dev(target, p, anchor);
    			insert_dev(target, t4, anchor);
    			insert_dev(target, div, anchor);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(div, null);
    			}

    			current = true;

    			if (!mounted) {
    				dispose = listen_dev(button, "click", /*close*/ ctx[2], false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*initCell, selectableTypes, types, selectType*/ 10) {
    				each_value = selectableTypes();
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$1(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    						transition_in(each_blocks[i], 1);
    					} else {
    						each_blocks[i] = create_each_block$1(child_ctx);
    						each_blocks[i].c();
    						transition_in(each_blocks[i], 1);
    						each_blocks[i].m(div, null);
    					}
    				}

    				group_outros();

    				for (i = each_value.length; i < each_blocks.length; i += 1) {
    					out(i);
    				}

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;

    			for (let i = 0; i < each_value.length; i += 1) {
    				transition_in(each_blocks[i]);
    			}

    			current = true;
    		},
    		o: function outro(local) {
    			each_blocks = each_blocks.filter(Boolean);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				transition_out(each_blocks[i]);
    			}

    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(button);
    			if (detaching) detach_dev(t0);
    			if (detaching) detach_dev(h1);
    			if (detaching) detach_dev(t2);
    			if (detaching) detach_dev(p);
    			if (detaching) detach_dev(t4);
    			if (detaching) detach_dev(div);
    			destroy_each(each_blocks, detaching);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_1.name,
    		type: "slot",
    		source: "(24:4) <DialogContent aria-label=\\\"Announcement\\\" class=\\\"content\\\">",
    		ctx
    	});

    	return block;
    }

    // (23:2) <DialogOverlay isOpen={$isOpen} onDismiss={close} class="overlay">
    function create_default_slot(ctx) {
    	let dialogcontent;
    	let current;

    	dialogcontent = new DialogContent({
    			props: {
    				"aria-label": "Announcement",
    				class: "content",
    				$$slots: { default: [create_default_slot_1] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(dialogcontent.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(dialogcontent, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const dialogcontent_changes = {};

    			if (dirty & /*$$scope*/ 2048) {
    				dialogcontent_changes.$$scope = { dirty, ctx };
    			}

    			dialogcontent.$set(dialogcontent_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(dialogcontent.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(dialogcontent.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(dialogcontent, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot.name,
    		type: "slot",
    		source: "(23:2) <DialogOverlay isOpen={$isOpen} onDismiss={close} class=\\\"overlay\\\">",
    		ctx
    	});

    	return block;
    }

    function create_fragment$2(ctx) {
    	let dialogoverlay;
    	let current;

    	dialogoverlay = new DialogOverlay({
    			props: {
    				isOpen: /*$isOpen*/ ctx[0],
    				onDismiss: /*close*/ ctx[2],
    				class: "overlay",
    				$$slots: { default: [create_default_slot] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(dialogoverlay.$$.fragment);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			mount_component(dialogoverlay, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			const dialogoverlay_changes = {};
    			if (dirty & /*$isOpen*/ 1) dialogoverlay_changes.isOpen = /*$isOpen*/ ctx[0];

    			if (dirty & /*$$scope*/ 2048) {
    				dialogoverlay_changes.$$scope = { dirty, ctx };
    			}

    			dialogoverlay.$set(dialogoverlay_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(dialogoverlay.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(dialogoverlay.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(dialogoverlay, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$2.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$2($$self, $$props, $$invalidate) {
    	let $isOpen;
    	let $cells;
    	let $selectedCell;
    	validate_store(isOpen, "isOpen");
    	component_subscribe($$self, isOpen, $$value => $$invalidate(0, $isOpen = $$value));
    	validate_store(cells, "cells");
    	component_subscribe($$self, cells, $$value => $$invalidate(5, $cells = $$value));
    	validate_store(selectedCell, "selectedCell");
    	component_subscribe($$self, selectedCell, $$value => $$invalidate(6, $selectedCell = $$value));
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("Modal", slots, []);
    	let types = selectableTypes();

    	const open = () => {
    		set_store_value(isOpen, $isOpen = true, $isOpen);
    	};

    	const close = () => {
    		set_store_value(isOpen, $isOpen = false, $isOpen);
    	};

    	const selectType = type => {
    		set_store_value(cells, $cells = $cells.map(c => c.id == $selectedCell ? { ...c, type } : c), $cells);
    		close();
    	};

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<Modal> was created with unknown prop '${key}'`);
    	});

    	const func = type => selectType(type.id);

    	$$self.$capture_state = () => ({
    		DialogOverlay,
    		DialogContent,
    		isOpen,
    		selectedCell,
    		cells,
    		initCell,
    		selectableTypes,
    		Cell,
    		types,
    		open,
    		close,
    		selectType,
    		$isOpen,
    		$cells,
    		$selectedCell
    	});

    	$$self.$inject_state = $$props => {
    		if ("types" in $$props) $$invalidate(1, types = $$props.types);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [$isOpen, types, close, selectType, func];
    }

    class Modal extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$2, create_fragment$2, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Modal",
    			options,
    			id: create_fragment$2.name
    		});
    	}
    }

    /* src/components/coins.svelte generated by Svelte v3.38.2 */
    const file$1 = "src/components/coins.svelte";

    function get_each_context(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[4] = list[i];
    	return child_ctx;
    }

    // (14:4) {#each Array.from({length: 14}, (v, k) => k) as index}
    function create_each_block(ctx) {
    	let button;
    	let mounted;
    	let dispose;

    	function click_handler() {
    		return /*click_handler*/ ctx[2](/*index*/ ctx[4]);
    	}

    	const block = {
    		c: function create() {
    			button = element("button");
    			attr_dev(button, "class", "coin svelte-1exxeds");
    			toggle_class(button, "coin-earn", /*index*/ ctx[4] < /*$coins*/ ctx[0]);
    			add_location(button, file$1, 14, 8, 290);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, button, anchor);

    			if (!mounted) {
    				dispose = listen_dev(button, "click", click_handler, false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;

    			if (dirty & /*Array, $coins*/ 1) {
    				toggle_class(button, "coin-earn", /*index*/ ctx[4] < /*$coins*/ ctx[0]);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(button);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block.name,
    		type: "each",
    		source: "(14:4) {#each Array.from({length: 14}, (v, k) => k) as index}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$1(ctx) {
    	let div;
    	let each_value = Array.from({ length: 14 }, func);
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block(get_each_context(ctx, each_value, i));
    	}

    	const block = {
    		c: function create() {
    			div = element("div");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			attr_dev(div, "class", "coins svelte-1exxeds");
    			add_location(div, file$1, 12, 0, 203);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(div, null);
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*Array, $coins, setCoin*/ 3) {
    				each_value = Array.from({ length: 14 }, func);
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(div, null);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value.length;
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			destroy_each(each_blocks, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$1.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    const func = (v, k) => k;

    function instance$1($$self, $$props, $$invalidate) {
    	let $coins;
    	validate_store(coins, "coins");
    	component_subscribe($$self, coins, $$value => $$invalidate(0, $coins = $$value));
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("Coins", slots, []);

    	const setCoin = quantity => {
    		set_store_value(coins, $coins = quantity, $coins);
    	};

    	const addCoin = (quantity = 1) => {
    		set_store_value(coins, $coins += quantity, $coins);
    	};

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<Coins> was created with unknown prop '${key}'`);
    	});

    	const click_handler = index => {
    		setCoin(index + 1 == $coins ? index : index + 1);
    	};

    	$$self.$capture_state = () => ({ coins, setCoin, addCoin, $coins });
    	return [$coins, setCoin, click_handler];
    }

    class Coins extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$1, create_fragment$1, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Coins",
    			options,
    			id: create_fragment$1.name
    		});
    	}
    }

    /* src/App.svelte generated by Svelte v3.38.2 */
    const file = "src/App.svelte";

    function create_fragment(ctx) {
    	let main;
    	let div2;
    	let div0;
    	let p0;
    	let t1;
    	let h10;
    	let t2;
    	let t3;
    	let p1;
    	let t5;
    	let h11;
    	let t6;
    	let t7;
    	let div1;
    	let t8;
    	let board;
    	let t9;
    	let coins;
    	let t10;
    	let modal;
    	let current;
    	board = new Board({ $$inline: true });
    	coins = new Coins({ $$inline: true });
    	modal = new Modal({ $$inline: true });

    	const block = {
    		c: function create() {
    			main = element("main");
    			div2 = element("div");
    			div0 = element("div");
    			p0 = element("p");
    			p0.textContent = "Cartographer :";
    			t1 = space();
    			h10 = element("h1");
    			t2 = text(/*name*/ ctx[0]);
    			t3 = space();
    			p1 = element("p");
    			p1.textContent = "Title :";
    			t5 = space();
    			h11 = element("h1");
    			t6 = text(/*title*/ ctx[1]);
    			t7 = space();
    			div1 = element("div");
    			t8 = space();
    			create_component(board.$$.fragment);
    			t9 = space();
    			create_component(coins.$$.fragment);
    			t10 = space();
    			create_component(modal.$$.fragment);
    			attr_dev(p0, "class", "label svelte-orclko");
    			add_location(p0, file, 12, 3, 281);
    			attr_dev(h10, "class", "name svelte-orclko");
    			add_location(h10, file, 13, 3, 320);
    			attr_dev(p1, "class", "label svelte-orclko");
    			add_location(p1, file, 14, 3, 352);
    			attr_dev(h11, "class", "title svelte-orclko");
    			add_location(h11, file, 15, 3, 384);
    			attr_dev(div0, "class", "cartographer-infos");
    			add_location(div0, file, 11, 2, 245);
    			attr_dev(div1, "class", "compass svelte-orclko");
    			add_location(div1, file, 17, 2, 426);
    			attr_dev(div2, "class", "header svelte-orclko");
    			add_location(div2, file, 10, 1, 222);
    			attr_dev(main, "class", "app svelte-orclko");
    			add_location(main, file, 9, 0, 202);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, main, anchor);
    			append_dev(main, div2);
    			append_dev(div2, div0);
    			append_dev(div0, p0);
    			append_dev(div0, t1);
    			append_dev(div0, h10);
    			append_dev(h10, t2);
    			append_dev(div0, t3);
    			append_dev(div0, p1);
    			append_dev(div0, t5);
    			append_dev(div0, h11);
    			append_dev(h11, t6);
    			append_dev(div2, t7);
    			append_dev(div2, div1);
    			append_dev(main, t8);
    			mount_component(board, main, null);
    			append_dev(main, t9);
    			mount_component(coins, main, null);
    			append_dev(main, t10);
    			mount_component(modal, main, null);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (!current || dirty & /*name*/ 1) set_data_dev(t2, /*name*/ ctx[0]);
    			if (!current || dirty & /*title*/ 2) set_data_dev(t6, /*title*/ ctx[1]);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(board.$$.fragment, local);
    			transition_in(coins.$$.fragment, local);
    			transition_in(modal.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(board.$$.fragment, local);
    			transition_out(coins.$$.fragment, local);
    			transition_out(modal.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(main);
    			destroy_component(board);
    			destroy_component(coins);
    			destroy_component(modal);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("App", slots, []);
    	let { name } = $$props;
    	let { title } = $$props;
    	const writable_props = ["name", "title"];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<App> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ("name" in $$props) $$invalidate(0, name = $$props.name);
    		if ("title" in $$props) $$invalidate(1, title = $$props.title);
    	};

    	$$self.$capture_state = () => ({ Board, Modal, Coins, name, title });

    	$$self.$inject_state = $$props => {
    		if ("name" in $$props) $$invalidate(0, name = $$props.name);
    		if ("title" in $$props) $$invalidate(1, title = $$props.title);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [name, title];
    }

    class App extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance, create_fragment, safe_not_equal, { name: 0, title: 1 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "App",
    			options,
    			id: create_fragment.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*name*/ ctx[0] === undefined && !("name" in props)) {
    			console.warn("<App> was created without expected prop 'name'");
    		}

    		if (/*title*/ ctx[1] === undefined && !("title" in props)) {
    			console.warn("<App> was created without expected prop 'title'");
    		}
    	}

    	get name() {
    		throw new Error("<App>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set name(value) {
    		throw new Error("<App>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get title() {
    		throw new Error("<App>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set title(value) {
    		throw new Error("<App>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    const app = new App({
    	target: document.body,
    	props: {
    		name: 'Corentin',
    		title: 'World'
    	}
    });

    return app;

}());
//# sourceMappingURL=bundle.js.map

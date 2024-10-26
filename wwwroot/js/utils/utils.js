class Utils {
    useState() {

    }

    addCustomAttributeIfMissing(qSelectorAll) {
        const allNodes = document.querySelectorAll(qSelectorAll.trim() + " " + "*");
        allNodes.forEach(node => {
            if (!node.hasAttribute('b-ga0mknigks')) {
                node.setAttribute('b-ga0mknigks', '');
            }
        });
    }

    isEqual(obj1, obj2) {
        var props1 = Object.getOwnPropertyNames(obj1);
        var props2 = Object.getOwnPropertyNames(obj2);
        if (props1.length != props2.length) {
            return false;
        }
        for (var i = 0; i < props1.length; i++) {
            let val1 = obj1[props1[i]];
            let val2 = obj2[props1[i]];
            let isObjects = this.isObject(val1) && this.isObject(val2);
            if (isObjects && !this.isEqual(val1, val2) || !isObjects && val1 !== val2) {
                return false;
            }
        }
        return true;
    }

    isObject(object) {
      return object != null && typeof object === 'object';
    }

    removeFromObj(object, element) {
        
    }
}

export default Utils;

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

    findObjectByEquality(obj, target) {
        try {
            const isObj = this.isObject(obj);
    
            if (!isObj) throw new Error("The param inserted is not an object.");
    
            if (this.isEqual(obj, target)) {
                return obj;
            }
    
            for (let key in obj) {
                if (obj.hasOwnProperty(key)) {
                    const result = this.findObjectByEquality(obj[key], target);
                    if (result) return result;
                }
            }

            return null;
        } catch (error) {
            return {
                "Param: ": obj,
                "Error: ": error
            };
        }
    }

    filterObject(params) {
        if (!params['getDetails']) {
            params['getDetails'] = false
        }

        const target = [];
        const field = params['field'];
        let objList = params['objList'];

        if (!Array.isArray(objList)) {
            objList = Object.values(objList)
        }

        for (let i = 0; i < objList.length; i++) {
            if (objList[i][field] === params['reference']) {
                target.push(params['objList'][i]);
            }
        }

        if (params['getDetails']) {
            const size = Object.keys(objList).length;
            const keys = Object.keys(objList)
            const values = Object.values(objList)

            return {
                'target': target,
                'index': size - 1,
                size,
                keys,
                values
            };
        }

        return target;
    }

    deleteObjFromObj(objList, field, reference) {
        const details = 
            this.filterObject({
                objList, 
                field, 
                reference,
                getDetails: true
            });

        delete objList[details['index']];
    }
}

export default Utils;

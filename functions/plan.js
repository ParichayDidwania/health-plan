const { ERROR_TYPES, CustomError } = require("../error-manager/errorManager");

class PlanFunctions {
    static patchObject(target, patch) {
        for (const key in patch) {
            if (Array.isArray(patch[key])) {
                if(Array.isArray(target[key])) {
                    const existingObjectIds = target[key].map(obj => obj.objectId);
                    for (const obj of patch[key]) {
                        if(obj.objectId && !existingObjectIds.includes(obj.objectId)) {
                            target[key].push(obj);
                        }
                    }
                }
            } else if (typeof patch[key] === 'object') {
                target[key] = PlanFunctions.patchObject(target[key], patch[key]);
            } else {
                if (key != 'objectId' || (key == 'objectId' && target[key] == patch[key])) {
                    target[key] = patch[key];
                } else {
                    throw new CustomError(ERROR_TYPES.PATCH_OBJECT_ID);
                }
            }
        }

        return target;
    }
}

module.exports = PlanFunctions;

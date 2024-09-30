const Ajv = require("ajv")
const ajv = new Ajv();

const planCostSharesSchema = {
    "type": "object",
    "properties": {
      "deductible": {
        "type": "integer",
      },
      "_org": {
        "type": "string",
      },
      "copay": {
        "type": "integer",
      },
      "objectId": {
        "type": "string"
      },
      "objectType": {
        "type": "string",
      }
    },
    "required": ["deductible", "_org", "copay", "objectId", "objectType"],
    "additionalProperties": false
}

const linkedServiceSchema = {
    "type": "object",
    "properties": {
        "_org": {
            "type": "string",
        },
        "objectId": {
            "type": "string"
        },
        "objectType": {
            "type": "string",
        },
        "name": {
            "type": "string"
        }
    },
    "required": ["_org", "objectId", "objectType", "name"],
    "additionalProperties": false
}

const planserviceCostSharesSchema = {
    "type": "object",
    "properties": {
      "deductible": {
        "type": "integer",
      },
      "_org": {
        "type": "string",
      },
      "copay": {
        "type": "integer",
      },
      "objectId": {
        "type": "string"
      },
      "objectType": {
        "type": "string",
      }
    },
    "required": ["deductible", "_org", "copay", "objectId", "objectType"],
    "additionalProperties": false
}

const linkedPlanServicesSchema = {
    "type": "array",
    "items": {
      "type": "object",
      "properties": {
        "linkedService": linkedServiceSchema,
        "planserviceCostShares": planserviceCostSharesSchema,
        "_org": {
          "type": "string",
        },
        "objectId": {
              "type": "string"
        },
        "objectType": {
            "type": "string",
        }
      },
      "required": ["linkedService", "planserviceCostShares", "_org", "objectId", "objectType"],
      "additionalProperties": false
    }
}

const planPostSchema = {
    "type": "object",
    "properties": {
      "planCostShares": planCostSharesSchema,
      "linkedPlanServices": linkedPlanServicesSchema,
      "_org": {
        "type": "string"
      },
      "objectId": {
        "type": "string"
      },
      "objectType": {
        "type": "string",
      },
      "planType": {
        "type": "string",
      },
      "creationDate": {
        "type": "string",
      }
    },
    "required": [
      "planCostShares",
      "linkedPlanServices",
      "_org",
      "objectId",
      "objectType",
      "planType",
      "creationDate"
    ],
    "additionalProperties": false
}

const validatePlanPost = ajv.compile(planPostSchema);
module.exports = validatePlanPost

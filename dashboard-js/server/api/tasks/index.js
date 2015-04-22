'use strict';

var express = require('express');
var controller = require('./tasks.controller');

var router = express.Router();

router.get('/', controller.index);
router.get('/:taskId/events', controller.getAllTaskEvents);
router.get('/:taskId/attachments', controller.getAttachments);
router.get('/:taskId/document', controller.getDocument);
router.get('/:taskId/form', controller.getForm);
router.post('/:taskId/form', controller.submitForm);
router.put('/:taskId', controller.updateTask);

module.exports = router;

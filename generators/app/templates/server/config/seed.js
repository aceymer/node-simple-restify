/**
 * Populate DB with sample data on server start
 * to disable, edit config/environment/index.js, and set `seedDB: false`
 */
 /*jshint esversion: 6 */

'use strict';
import User from '../api/user/user.model';

User.find({}).removeAsync()
  .then(() => {
    User.createAsync({
        _id: '569e69cc1ab998358d37667e',
        provider: 'local',
        name: 'Test User',
        email: 'test@example.com',
        role: ['user'],
        password: 'test'
      }, {
        _id: '569e69cc1ab998358d37667d',
        provider: 'local',
        role: ['admin', 'user', 'superAdmin'],
        name: 'Admin',
        email: 'admin@example.com',
        password: 'admin'
      })
      .then(() => {
        console.log('finished populating users');
      });
  });

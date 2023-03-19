import View from './src/view.js'
import Controller from './src/controller.js'
import Model from './src/model.js'

const app = new Controller(new Model(), new View());

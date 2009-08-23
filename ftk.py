import cgi
import os

from google.appengine.ext import webapp
from google.appengine.ext import db

from google.appengine.ext.webapp import template
from google.appengine.ext.webapp.util import run_wsgi_app

from google.appengine.api import users

class MainPage(webapp.RequestHandler):
  def get(self):
    template_values = {
      'title': "Fondation Toolkit",
      }

    path = os.path.join(os.path.dirname(__file__), 'templates/index.html')
    self.response.out.write(template.render(path, template_values))

application = webapp.WSGIApplication(
                                     [('/', MainPage)],
                                     debug=True)

def main():
  run_wsgi_app(application)

if __name__ == "__main__":
  main()

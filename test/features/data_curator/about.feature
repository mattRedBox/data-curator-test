Feature: About
  As a Data Packager or Data Consumer
  I want to know the version of the application
  So that I can inform the Maintainer about issues I experience using a version of the application

  As a Sponsor, Contributor or Maintainer of the application
  I want to see acknowledgement of my contribution
  So that I can confirm that licencing requirements or other obligations have been met

  RULES
  =====

  - The "About" command can be invoked using a menu item
  - The "Close About Panel" is invoked using a button on the About panel

  USER INTERFACE
  ==============

  ![About panel user interface](https://raw.githubusercontent.com/ODIQueensland/data-curator/develop/static/img/ui/about.png)

#  @dev
  Scenario Outline: Show the About panel
    Given Data Curator is open
    When "About" is invoked
    Then the "About Properties" panel should be displayed
    And the major contributor: "<name>" with attribution statements and logo: "<logo>" should be displayed
#    And the Application logo, name, and version should be shown
    Examples:
      | name                                        | logo                |
      | Queensland Government                       | advance_qld_logo    |
      | ODI Australian Network                      | odi_aus_logo        |
      | Queensland Cyber Infrastructure Foundation  | qcif_logo           |
      | Frictionless Data                           | frictionless-data   |

  @dev
  Scenario Outline: Click on the About panel sponsors's links
    Given Data Curator is open
    And "About" is invoked
    When the logo: "<logo>" is clicked
#    Then a call to open an external url, "<url>", should be made
    Examples:
      | logo                | url                         |
      | advance_qld_logo    | http://advance.qld.gov.au/  |
      | odi_aus_logo        | https://theodi.org.au/      |
      | qcif_logo           | https://www.qcif.edu.au     |
      | frictionless-data   | https://frictionlessdata.io |

  Scenario: Close the About panel
    Given Data Curator is open
    And "About" is invoked
    When "Close About Panel" is invoked
    Then the About panel should close

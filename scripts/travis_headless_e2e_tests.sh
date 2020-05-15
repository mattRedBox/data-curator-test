#!/bin/bash

yarn run clean && yarn run pack && yarn run cucumber:postpack:witharg $@

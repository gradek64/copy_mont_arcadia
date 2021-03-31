#!/bin/bash

DELETE_FILES=$1

if [[ $DELETE_FILES == 'DELETE_CRITICAL' ]]; then
    echo "Remove all existing critical css from public directory ...."
    rm ./public/*/critical.css;
fi

wait_for_critical_css() {
  echo "Wait for critical css checking your .env file BRANDS..."

  #give us all the brands from the environment variables
  brands=$(grep BRANDS .env | grep -v '#' | grep -v ';' | cut -d '=' -f2)

  if [[ -z  $brands  ]]; then
    echo "There are no BRANDS in your .env file, we will check all BRANDS in public directory ..."
    brands="topshop,burton,wallis,topman,evans,missselfridge,dorothyperkins"
  fi

  for brandFolder in ./public/*; do

    if [[ -d ${brandFolder} && $brandFolder != *"common"* ]]; then
      if [[ $brands ]]; then
        #get the brand
        brand=$(echo $brandFolder | cut -d '/' -f3)

        if [[ $brands == *"$brand"* ]]; then
          if [ -f ${brandFolder}/critical.css ]; then
             echo "Found critical css file in $brandFolder!"
          else
            echo "Did not find generated critical css via webpack files in $brandFolder ... waiting for webpack to compile ... trying again."
            sleep 5
            wait_for_critical_css
            break
          fi
        fi
      fi
    fi
  done
}

wait_for_critical_css

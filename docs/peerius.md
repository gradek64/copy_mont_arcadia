# Peerius

## What is Peerius?

Peerius is a 3rd party company which provides personalised recommendations to customers on the sites. We provide
Peerius the catalogue of products over night and as a user travels around the app or makes purchases we report their actions
to Peerius.

Using this data and the users account data (if available) Peerius will tailor some products it believes the user will be
interested in. It then responds with an array of products containing all the information we need to display them.


## How do we send information to Peerius

To submit information to Peerius you need to use the ```<Peerius />``` component providing it a type and the data to send.
The component watches this data, and on first render or on change of the data it will submit to peerius. To do so it has
to modify the structure which is done through a series of libs in the peerius-tracking folder.

This data gets set into the peeriusReducer, which controls the extra data being sent to peerius, the callbacks used when
to load the Peerius client Javascript library. This reducer keeps the window property `PeeriusCallbacks` in sync with the
reducer state. This property is what the Peerius library reads from to pull it's recommendations. Upon change of the data
our Peerius reducer forces it to read and re-submit using sneaky hacks.


## How do we receive recommendations

To keep the recommendations and their display logic separate from Peerius they are linked together in only one place.

```javascript
// Main.jsx
componentWillMount() {
  const { setPeeriusCallback, setRecommendations } = this.props
  if (process.browser) {
    setPeeriusCallback(setRecommendations)
  }
}
```

When the app boots on client side it registers the ```setRecommendations``` action as the peerius callback. Meaning any
time Peerius sends us recommendation data, by way of a callback function in their library, this action is called and the
Recommendations component updates as per any other part of the app.


## How do we add Peerius to a new environment

As the Peerius Javascript lib directly calls their servers they have protected themselves from spam attacks by whitelisting
all environments their clients use. To enable peerius on a new environment you must email servicedesk@peerius.com and ask
nicely!


## What about those sneaky hacks?

When writing the Peerius integration for Monty the only interactions had previously been for single pages rather than a
single page web application. You would set your properties on the window.PeeriusCallbacks in a script tag, then load the
JavaScript library and it would immediately report that data and then cease.

What we needed was more interactive where we could repeatedly call the JavaScript to report new user actions and retrieve
new recommendations. To achieve this there are a series of hacks in place in peeriusReducer.js. The initial event operates
the same as previously and is handled by the library. After that we directly alter the 'extraXml' property of peerius to
reflect the latest tracking event, and call `.dynamic()` on the library to force it to re-submit.

Peerius have since developed their JSON Api to allow all interactions to go through this, but as the existing solution works
there has been no impetus to refactor yet.


## What needs doing to Peerius in the future?

The above hacks are fairly stable but do not protect against any changes Peerius makes to its library and should be removed
and replaced with access to the new JSON Api.

We also do not utilise one of the features Peerius offers, multiple recommendation widgets. When they send us recommendations
then include information of which 'widget' this is supposed to update. Currently we ignore this data and just update our
only recommendations component. Investigation should be done in to the value of this splitting and if it will benefit us.
As with the sneaky hacks the old approach was based around single pages - it may now be that approach is outdated.

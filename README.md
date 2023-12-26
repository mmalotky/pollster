Description:
Discord Bot for creating polls in text channels. Polls are displayed as a menu with customizable
options for channel members to choose from. All polls will have an expiration date, upon which,
Pollster will send the cumulative results of the poll. Up to this expiration date, there will be
automated reminders to inform users of the impending expiration.

Commands:
/poll      -  displays a modal to build a new poll. Modals are currently limited to text inputs, 
        so user entries are verified after submition. After the modal, the user will be asked 
        to confirm and start the poll, or return to editing.
/schedule  -  allows the user to modify the end date/time of an active poll in the current text
        channel. The user will be provided a list of polls to choose from, and upon selecting an
        active poll, the user may fill out a modal with a new end date and time.

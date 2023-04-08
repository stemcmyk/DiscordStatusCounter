# DiscordStatusCounter

Wacky thing, kinda shit, but works right?

## Techios

It creates a sqlite db and stores the number in there and when the shebang started. It then increments the number every 5 seconds and updates the status.

## Output

it will set your discord status to `Count is: XXXX; Count started: MM/DD/YYYY, <12-hour clock>;`

## How to use

1. Clone the repo
2. Run `npm install` or `yarn install`
3. Duplicate `.env.example` and rename it to `.env`
4. Add your user's token to the `.env` file (I will not provide any docs on getting your discord token as that is a touchy subject)
5. Run `npm dev` or `yarn dev` to start the incrementor
6. Then if you want you can run `npm build` or `yarn build` to build the app
7. And run it using `npm start` or `yarn start`

There is like a docker thingy but I don't want to write docs for that so you can figure it out yourself

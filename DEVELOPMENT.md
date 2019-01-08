# Launch the testnet

To launch the Ethereum testnet blockchain, open a separate terminal and launch ganache-cli:

```
ganache-cli  --gasLimit 0xfffffffffff
```

# Development and testing:

In another terminal:

Change into working directory for smart contracts (without the “>”):

```
cd ~/Development/yair/yair-token
```

Checkout recent changes:

```
git pull
```

Compile the code:

```
truffle compile
```

Deploy the code on the test net:

```
truffle migrate
```

Running unit tests:

```
truffle test
```


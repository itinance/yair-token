const truffleAssert = require('truffle-assertions');

const OwnableMultiple = artifacts.require("OwnableMultiple");

contract('OwnableMultiple', ([_, creator, ...accounts]) => {

    let inst
      , tx;

    const secondOwner = accounts[0],
      thirdOwner = accounts[1]

    beforeEach('setup the contract instance', async () => {
        inst = await OwnableMultiple.new({from: creator});
        tx = inst.transactionHash;
    });

    it("Creator should be first owner", async () => {
        const result = await truffleAssert.createTransactionResult(inst, tx);

        let i = 0;
        await truffleAssert.eventEmitted(result, 'OwnershipAdded', (ev) => {
            ++i;
            return ev.newOwner === creator && ev.addedByOwner === creator;
        });

        // only one event should have been fired
        assert.isTrue(i === 1);
    });

    it("Adding a new owner by creator should be allowed and work well", async () => {
      const tx = await inst.addOwner(secondOwner, {from: creator});

      await truffleAssert.eventEmitted(tx, 'OwnershipAdded', (ev) => {
          return ev.newOwner === secondOwner && ev.addedByOwner === creator;
      });
    });

    it("Adding a new owner by a NOT-Owner should be reverted", async () => {
      await truffleAssert.reverts ( inst.addOwner(secondOwner, {from: thirdOwner}) );
    });

    it("Adding a new owner by another owner should be allowed and work well", async () => {
      await inst.addOwner(secondOwner, {from: creator});
      const tx = await inst.addOwner(thirdOwner, {from: secondOwner});

      await truffleAssert.eventEmitted(tx, 'OwnershipAdded', (ev) => {
          return ev.newOwner === thirdOwner && ev.addedByOwner === secondOwner;
      });
    });

    it("Removing an owner by another owner should be allowed and work well", async () => {
      await inst.addOwner(secondOwner, {from: creator});
      await inst.addOwner(thirdOwner, {from: secondOwner});

      const tx = await inst.removeOwner(thirdOwner, {from: secondOwner});

      await truffleAssert.eventEmitted(tx, 'OwnershipRemoved', (ev) => {
          return ev.oldOwner === thirdOwner && ev.removedByOwner === secondOwner;
      });
    });

    it("2, Removing an owner by another owner should be allowed and work well", async () => {
      await inst.addOwner(secondOwner, {from: creator});
      await inst.addOwner(thirdOwner, {from: secondOwner});

      const tx = await inst.removeOwner(secondOwner, {from: thirdOwner});

      await truffleAssert.eventEmitted(tx, 'OwnershipRemoved', (ev) => {
          return ev.oldOwner === secondOwner && ev.removedByOwner === thirdOwner;
      });
    });

    it("Removing an owner by a NOT-Owner should be reverted", async () => {
      await inst.addOwner(secondOwner, {from: creator});

      await truffleAssert.reverts ( inst.addOwner(secondOwner, {from: thirdOwner}) );
    });

    it("Removing the very first owner (creator) by another owner should be allowed and work well", async () => {
      await inst.addOwner(secondOwner, {from: creator});
      await inst.addOwner(thirdOwner, {from: secondOwner});

      const tx = await inst.removeOwner(creator, {from: secondOwner});

      await truffleAssert.eventEmitted(tx, 'OwnershipRemoved', (ev) => {
          return ev.oldOwner === creator && ev.removedByOwner === secondOwner;
      });
    });

    it("Owner can be removed by one owner and added back by another owner", async () => {
      await inst.addOwner(secondOwner, {from: creator});
      await inst.addOwner(thirdOwner, {from: secondOwner});

      let tx = await inst.removeOwner(creator, {from: secondOwner});

      await truffleAssert.eventEmitted(tx, 'OwnershipRemoved', (ev) => {
          return ev.oldOwner === creator && ev.removedByOwner === secondOwner;
      });

      tx = await inst.addOwner(creator, {from: thirdOwner});

      await truffleAssert.eventEmitted(tx, 'OwnershipAdded', (ev) => {
        return ev.newOwner === creator && ev.addedByOwner === thirdOwner;
      });

    });

});

const $ = (selector) => document.querySelector(selector);


const url = new URL(location.href)
const searchParams = new URLSearchParams(url.search)
const transactionId = searchParams.get('transactionId')
const price = searchParams.get('price')

const paymentSucceed = $("[name=payment-succeed]");
const paymentCancelled = $("[name=payment-cancel]");
// const paymentFailed = $("[name=payment-failed]");

paymentSucceed.addEventListener("click", async (evt) => {
  evt.preventDefault();

  const fields = {
    product: "667ea9b1df5d6c0e864f1841",
    price,
  };

	try {
		
  const res = await fetch(`/api/payments/success/${transactionId}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(fields),
  });

  const { data } = await res.json();
  console.log(data)


	} catch (error) {
  	console.log(error);
	}
});

paymentCancelled.addEventListener("click", async (evt) => {
  evt.preventDefault();

	try {
		
  const res = await fetch(`/api/payments/cancel/${transactionId}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({}),
  });

  const { data } = await res.json();
  console.log(data)


	} catch (error) {
  	console.log(error);
	}
});

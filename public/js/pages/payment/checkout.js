
const $ = (selector) => document.querySelector(selector);


const generatePayLink = $("[name=generate-path]");
const payButton = $("[name=checkout]");

generatePayLink.addEventListener("click", async (evt) => {
  evt.preventDefault();

  const fields = {
    product: "667ea9b1df5d6c0e864f1841",
    price: 6000,
  };

	try {
		
  const res = await fetch("/api/payments/request", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(fields),
  });

  const { data } = await res.json();
  // console.log(data)

  const a = document.createElement("a");
  a.href = data.gatewayPageUrl;
  a.textContent = "Pay Now";

  payButton.appendChild(a);
  payButton.hidden = false;

  // console.log(a);

	} catch (error) {
  	console.log(error);
	}
});

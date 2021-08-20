const d = document;

const selectedMenu = (e) => {
  const $selectWrapper = d.querySelector(".select-wrapper");
  const $customOption = d.querySelectorAll(".custom-option");
  const wrapper = ".select-wrapper";

  d.addEventListener("click", (e) => {
    if (e.target.matches(`${wrapper} *`)) {
      d.querySelector(".select").classList.toggle("open");
    }

    if (e.target.matches(".custom-option")) {
      const $option = e.target;
      [...$customOption].map((option) => option.classList.remove("selected"));
      $option.classList.add("selected");
      $option.closest(".select").querySelector(".select__trigger span").textContent = $option.textContent;
    }

    if (!e.target.matches(`${wrapper} *`)) {
      const $select = d.querySelector(".select");
      if ($select.classList.contains("open")) {
        $select.classList.remove("open");
      }
    }
  });
};

export default selectedMenu;

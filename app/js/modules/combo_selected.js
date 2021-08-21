const d = document;

const selectedMenu = (e) => {
  const wrapper = ".select-wrapper";

  d.addEventListener("click", (e) => {
    if (e.target.matches(`${wrapper} *`)) {
      const $selected = e.target.closest(".select");
      $selected.classList.toggle("open");
    }

    if (e.target.matches(".custom-option")) {
      const $option = e.target;
      const $listOptions = $option.parentElement.children;
      const $parentOption = $option.closest(".select");
      const $customSelectText = $parentOption.querySelector(".select-trigger > span");

      [...$listOptions].map((option) => option.classList.remove("selected"));
      $option.classList.add("selected");
      $customSelectText.textContent = $option.textContent;
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

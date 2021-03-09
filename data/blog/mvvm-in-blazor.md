---
title: MVVM in Blazor
date: '2021-03-09'
tags: ['blazor']
draft: false
summary: Simple MVVM for Blazor Server Side .NET 5
---

## TLDR

Note: I used that approach when Blazor was still in Alpha, so possibly now there is a superior way of doing MVVM in Blazor, if yes, please let me know.

I am using MvvmCross's default `MvxViewModel` but I don't really use majority of MvvmCross features there, so you can also build your own `BaseViewModel` class.

Source examples are coming from my project https://podatki.wtf

## Source code:

### Example ViewModel

```cs
    public class DonationViewModel : MvxViewModel
    {
        private bool _isDonationModalActive;

        public bool IsDonationModalActive
        {
            get => _isDonationModalActive;
            set => SetProperty(ref _isDonationModalActive, value);
        }
    }
```

### `Startup.cs`

```cs
        public void ConfigureServices(IServiceCollection services)
        {
                //...
                services.AddScoped<DonationViewModel>();
        }
```

### `DonationModal.razor.cs`

```cs
    public partial class DonationModal : ViewModelComponent<DonationViewModel>
    {
        //Empty code behind class
    }
```

### `ViewModalComponent<T>`

```cs
    public abstract class ViewModelComponent<T> : ComponentBase where T : MvxViewModel
    {
        [Inject] public T vm { get; set; }

        protected override Task OnInitializedAsync()
        {
            vm.PropertyChanged += (o, e) => OnViewModelUpdate();
            return base.OnInitializedAsync();
        }
        protected virtual void OnViewModelUpdate()
        {
            this.StateHasChanged();
        }
    }
```

### `DonationModal.razor`

```html
@using Podatki.wtf.ViewModel;
<!-- Important, partial declaration of ViewModelComponent<T>  -->
@inherits ViewModelComponent<DonationViewModel>
  @if (vm.IsDonationModalActive) {
  <div class="modal is-active">
    <!-- Calling View Model  -->
    <div class="modal-background" @onclick="() => this.vm.CloseDonationModal()"></div>
    <div class="modal-content">
      <div class="container notification" style="padding:40px;">
        <p class="is-size-5 has-text-centered mb-5">💕 Donate to podatki.wtf 💕</p>
        <div class="field has-addons">
          <div class="control is-expanded has-icons-left">
            <input
              class="input is-medium"
              type="text"
              placeholder="Adres e-mail do płatności PayU"
            />
            <span class="icon is-left">
              <i class="fas fa-envelope"></i>
            </span>
          </div>
        </div>
        <label class="checkbox mb-4">
          <input type="checkbox" />
          💌 Sign me for a newsletter
        </label>
        <p>Choose donation type:</p>
        <div class="buttons">
          <button class="button">
            <span>1x☕ (3,75 EUR)</span>
          </button>
          <button class="button">
            <span>2x☕ (7 EUR)</span>
          </button>
          <button class="button">
            <span>1x 🍰 (123 EUR)</span>
          </button>
          <button class="button">
            <span>Custom amount</span>
          </button>
        </div>
        <button class="button is-success is-fullwidth">Donate 123 EUR 😍</button>
      </div>
    </div>
    <!-- Calling View Model  -->
    <button
      class="modal-close is-large"
      aria-label="close"
      @onclick="() => this.vm.CloseDonationModal()"
    ></button>
  </div>
  }</DonationViewModel
>
```

### Calling other component's ViewModel

```html
<DonationModal @ref="donationModal" />
<!-- code... -->
<div class="notification is-info has-text-centered">
  <p>If this website is helpful for you can dontae using a button below</p>
  <button
    class="button is-warning mt-2"
    @onclick="() => donationModal.vm.IsDonationModalActive = true"
  >
    Buy me a coffee ☕
  </button>
</div>
```

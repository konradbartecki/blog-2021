---
title: Blazor Serverside - saving the state of a circuit
date: '2022-01-22'
tags: ['blazor']
draft: false
summary: How to save a state of the circuit in blazor server side
---

## Implementation

```cs
    public interface ICircuitIdContainer
    {
        string CircuitId { get; }
        
        void SetLastState(MainViewModel vm);
    }

    public class ScopedCircuitContainer : CircuitHandler, ICircuitIdContainer
    {
        private MainViewModel _vmLastState = null;
        private string _circuitId = null;

        public ScopedCircuitContainer()
        {
        }
        
        public override Task OnCircuitOpenedAsync(Circuit circuit, CancellationToken cancellationToken)
        {
            _circuitId = circuit.Id;
            return base.OnCircuitOpenedAsync(circuit, cancellationToken);
        }

        public override Task OnCircuitClosedAsync(Circuit circuit, CancellationToken cancellationToken)
        {
            if (_vmLastState != null)
            {
                //save state
            }
        }

        public string CircuitId => _circuitId;
        public void SetLastState(MainViewModel vm)
        {
            if (this.CircuitId != null)
            {
                _vmLastState = vm;
            }
        }
    }
```

## IoC Register

```cs
    services.AddScoped<ScopedCircuitContainer>(); //initial unused registration
    services.AddScoped<CircuitHandler, ScopedCircuitContainer>(a => a.GetRequiredService<ScopedCircuitContainer>()); //register alias for aspnetcore to use
    services.AddScoped<ICircuitIdContainer>(a => a.GetRequiredService<ScopedCircuitContainer>()); //register alias for our business code
    //without aliasing ScopedCircuitContainer like above it would result in 
    //servies.GetService<CircuitHandler>() being a different instance than 
    //services.GetService<ICircuitIdContainer>()
```